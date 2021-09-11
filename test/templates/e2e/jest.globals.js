const fastifyTestUtils = require('@forrestjs/service-fastify/test/globals');
const fetchqTestUtils = require('@forrestjs/service-fetchq/test/globals');
const jwtTestUtils = require('@forrestjs/service-jwt/test/globals');

const fastifyGlobals = fastifyTestUtils();
const fetchqGlobals = fetchqTestUtils(fastifyGlobals);
const jwtGlobals = jwtTestUtils(fastifyGlobals);

module.exports = () => ({
  ...fastifyGlobals,
  ...fetchqGlobals,
  jwtGlobals,
});
