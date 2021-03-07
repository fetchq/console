const { FEATURE_NAME } = require('./hooks');
const schema = require('./schema');

module.exports = ({ registerAction }) => {
  registerAction({
    hook: '$FETCHQ_READY',
    name: FEATURE_NAME,
    handler: async (_, { getContext }) => {
      try {
        const fetchq = getContext('fetchq');
        const query = fetchq.pool.query.bind(fetchq.pool);

        // Upsert schema:
        await schema.create(query);

        // Extract active workers
        const data = await query(
          `SELECT * FROM "fetchq"."console_functions" WHERE "status" = 1`,
        );

        // Start the workers:
        for (const fn of data.rows) {
          const { queue, source } = fn;
          const handler = new Function('doc', 'ctx', source);

          fetchq.workers.register({
            queue,
            handler,
          });
        }

        // Subscribe to changes in the functions table to dynamically
        // create/update/delete worker functions
        fetchq.emitter.addChannel(
          'fetchq_on_change',
          async ({ schema, table, operation, new_data, old_data }) => {
            if (schema === 'fetchq' && table === 'console_functions') {
              const fn = operation === 'DELETE' ? old_data : new_data;
              const { queue, source } = fn;
              const isActive = (worker) => worker.queue === queue;
              const isStopped = (worker) => worker.__toDelete !== true;

              // Stop workers associated with the queue:
              for (const worker of fetchq.workers.workers.filter(isActive)) {
                await worker.stop();
                worker.__toDelete = true;
              }

              // Filter out the stopped workers:
              fetchq.workers.workers = fetchq.workers.workers.filter(isStopped);

              // Register new worker for the queue
              // (only if it is NOT a delete operation)
              if (operation !== 'DELETE' && fn.status) {
                const handler = new Function('doc', 'ctx', source);
                fetchq.workers.register({
                  queue,
                  handler,
                });
              }
            }
          },
        );
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
        console.info('@TEST: reset functions/v1');
        const fetchq = getContext('fetchq');
        const query = fetchq.pool.query.bind(fetchq.pool);
        await schema.destroy(query);
        await schema.create(query);
      } catch (err) {
        console.log(err);
      }
    },
  });
};
