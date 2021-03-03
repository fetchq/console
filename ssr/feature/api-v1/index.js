const { FEATURE_NAME } = require('./hooks');

const { v1QueuesList } = require('./routes/v1-queues-list');
const { v1QueueDetails } = require('./routes/v1-queue-details');
const { v1QueueDocuments } = require('./routes/v1-queue-documents');
const { v1QueueLogs } = require('./routes/v1-queue-logs');

module.exports = ({ registerAction }) => {
  registerAction({
    hook: '$FASTIFY_PLUGIN',
    name: FEATURE_NAME,
    handler: ({ registerPlugin }) => {
      registerPlugin((fastify, _, done) => {
        fastify.addHook('preHandler', fastify.authenticate);
        fastify.route(v1QueueDocuments);
        fastify.route(v1QueueLogs);
        fastify.route(v1QueueDetails);
        fastify.route(v1QueuesList);
        done();
      });
    },
  });
};
