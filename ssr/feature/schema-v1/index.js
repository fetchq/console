const { FEATURE_NAME } = require('./hooks');
const schema = require('./schema');

// Destroys all queues and performs a hard reset on
// metrics and all related tables
const resetFetchq = async (fetchq) => {
  const queues = await fetchq.pool.query('SELECT * FROM fetchq.queues');
  for (const queue of queues.rows) {
    await fetchq.pool.query(`SELECT * FROM fetchq.queue_drop('${queue.name}')`);
  }
  await fetchq.pool.query(`TRUNCATE fetchq.queues RESTART IDENTITY CASCADE`);
  await fetchq.pool.query(`TRUNCATE fetchq.metrics RESTART IDENTITY CASCADE`);
  await fetchq.pool.query(`TRUNCATE fetchq.metrics_writes`);
  await fetchq.pool.query(
    `UPDATE fetchq.jobs SET 
      attempts = 0, 
      iterations = 0, 
      last_iteration = NULL, 
      next_iteration = NOW()`,
  );

  await fetchq.pool.query(`
    BEGIN;
    DROP SCHEMA IF EXISTS fetchq_data CASCADE;
    CREATE SCHEMA IF NOT EXISTS fetchq_data;
    COMMIT;
  `);
};

module.exports = ({ registerAction }) => {
  registerAction({
    hook: '$FETCHQ_READY',
    name: FEATURE_NAME,
    handler: async (_, { getContext }) => {
      try {
        const fetchq = getContext('fetchq');
        const query = fetchq.pool.query.bind(fetchq.pool);
        await schema.create(query);
      } catch (err) {
        console.log(err);
      }
    },
  });

  registerAction({
    hook: '$TDD_POSTGRESQL_RESET?',
    name: FEATURE_NAME,
    handler: async (_, { getContext }) => {
      try {
        console.info('@TEST: reset schema/v1');
        const fetchq = getContext('fetchq');
        const query = fetchq.pool.query.bind(fetchq.pool);
        await resetFetchq(fetchq);
        await schema.destroy(query);
        await schema.create(query);
      } catch (err) {
        console.log(err);
      }
    },
  });

  registerAction({
    hook: '$TDD_FASTIFY_ROUTE?',
    name: FEATURE_NAME,
    handler: ({ registerRoute }) => {
      registerRoute({
        method: 'GET',
        url: '/schema-v1/queues/stop',
        handler: async (request, reply) => {
          console.info('@TEST: stop queues schema/v1');
          const fetchq = request.getContext('fetchq');
          await fetchq.pool.query(
            `UPDATE fetchq_catalog.fetchq_sys_queues SET is_active = false`,
          );
          reply.send('+ok');
        },
      });

      registerRoute({
        method: 'GET',
        url: '/schema-v1/queues/start',
        handler: async (request, reply) => {
          console.info('@TEST: start queues schema/v1');
          const fetchq = request.getContext('fetchq');
          await fetchq.pool.query(
            `UPDATE fetchq_catalog.fetchq_sys_queues SET is_active = true`,
          );
          reply.send('+ok');
        },
      });
    },
  });
};
