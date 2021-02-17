const { SERVICE } = require('@forrestjs/hooks');

const SERVICE_NAME = `${SERVICE} tdd`;
const TDD_FASTIFY_ROUTE = `${SERVICE_NAME}/tdd/fastify/route`;
const TDD_HTTP_MOCKS = `${SERVICE_NAME}/tdd/mocks/http`;
const TDD_POSTGRESQL_READY = `${SERVICE_NAME}/tdd/state/pg/ready`;
const TDD_POSTGRESQL_RESET = `${SERVICE_NAME}/tdd/state/pg/reset`;

module.exports = {
  SERVICE_NAME,
  TDD_FASTIFY_ROUTE,
  TDD_HTTP_MOCKS,
  TDD_POSTGRESQL_READY,
  TDD_POSTGRESQL_RESET,
};
