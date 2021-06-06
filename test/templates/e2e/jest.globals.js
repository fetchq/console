const fastifyTestUtils = require('@forrestjs/service-fastify/test/globals');
const fetchqTestUtils = require('@forrestjs/service-fetchq/test/globals');
const jwtTestUtils = require('@forrestjs/service-jwt/test/globals');

const fastifyGlobals = fastifyTestUtils();
const fetchqGlobals = fetchqTestUtils(fastifyGlobals);
const jwtGlobals = jwtTestUtils(fastifyGlobals);

const dropAllQueues = async () => {
  const { fetchq } = fetchqGlobals
  const queuesList = await fetchq.query('SELECT name FROM "fetchq"."queues"');
  await queuesList.rows.map(_ => _.name).map(queueName => fetchq.query(`SELECT * FROM fetchq.queue_drop('${queueName}')`));
  await fastifyGlobals.pause(250)
  await fetchq.query('TRUNCATE TABLE "fetchq"."queues" RESTART IDENTITY');
  await fastifyGlobals.pause(250)
}

module.exports = () => ({
  ...fastifyGlobals,
  ...fetchqGlobals,
  jwtGlobals,
  dropAllQueues,
});
