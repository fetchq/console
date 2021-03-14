const { FEATURE_NAME } = require('./hooks');

const { v1QueuesList } = require('./routes/v1-queues-list');
const { v1QueueDetails } = require('./routes/v1-queue-details');
const { v1QueueDocs } = require('./routes/v1-queue-docs');
const { v1QueueLogs } = require('./routes/v1-queue-logs');
const { v1QueueDrop } = require('./routes/v1-queue-drop');
const { v1QueueDocumentPlay } = require('./routes/v1-document-play');
const { v1DocumentDetails } = require('./routes/v1-document-details');
const { v1LogDetails } = require('./routes/v1-log-details');

module.exports = ({ registerAction }) => {
  registerAction({
    hook: '$FASTIFY_PLUGIN',
    name: FEATURE_NAME,
    handler: ({ registerPlugin }) => {
      registerPlugin((fastify, _, done) => {
        fastify.addHook('preHandler', fastify.authenticate);
        fastify.route(v1QueueDocumentPlay);
        fastify.route(v1DocumentDetails);
        fastify.route(v1LogDetails);
        fastify.route(v1QueueDocs);
        fastify.route(v1QueueLogs);
        fastify.route(v1QueueDetails);
        fastify.route(v1QueuesList);
        fastify.route(v1QueueDrop);
        done();
      });
    },
  });
};
