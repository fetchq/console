const { FEATURE_NAME } = require('./hooks');

const { v1SessionCreate } = require('./routes/v1-session-create');
const { v1SessionDetails } = require('./routes/v1-session-details');
const { authenticateDecorator } = require('./decorators/authenticate');

module.exports = ({ registerAction }) => {
  registerAction({
    hook: '$FASTIFY_PLUGIN',
    name: FEATURE_NAME,
    handler: ({ registerPlugin, decorate, decorateRequest }) => {
      // The authenticate decorator is also used by the entire
      // APIv1 feature as barrier to access the functionalities.
      decorate('authenticate', authenticateDecorator);

      // Prepare the data key that will host the authentication
      // information around the application.
      decorateRequest('auth', null);

      registerPlugin((fastify, _, done) => {
        fastify.addHook('preHandler', fastify.authenticate);
        fastify.route(v1SessionDetails);
        done();
      });

      registerPlugin((fastify, _, done) => {
        fastify.route(v1SessionCreate);
        done();
      });
    },
  });
};
