const { FEATURE_NAME } = require('./hooks');

const { v1QueuesList } = require('./routes/v1-queues-list');
const { v1QueueDetails } = require('./routes/v1-queue-details');

module.exports = ({ registerAction }) => {
  registerAction({
    hook: '$FASTIFY_PLUGIN',
    name: FEATURE_NAME,
    handler: ({ registerPlugin }) => {
      registerPlugin((fastify, options, done) => {
        fastify.addHook('preHandler', fastify.authenticate);
        fastify.route(v1QueuesList);
        fastify.route(v1QueueDetails);
        done();
      });
    },
  });
};
