const { runHookApp } = require('@forrestjs/hooks');

/**
 * Services
 */
const serviceJwt = require('@forrestjs/service-jwt');
const serviceFetchq = require('@forrestjs/service-fetchq');
const serviceFastify = require('@forrestjs/service-fastify');
const serviceFastifyCors = require('@forrestjs/service-fastify-cors');
const serviceFastifyStatic = require('@forrestjs/service-fastify-static');
const serviceFastifyCookie = require('@forrestjs/service-fastify-cookie');
const serviceFastifyHealthz = require('@forrestjs/service-fastify-healthz');

/**
 * Features
 */

const featureSchemaV1 = require('./feature/schema-v1');
const featureFunctionsV1 = require('./feature/functions-v1');
const featureApiV1 = require('./feature/api-v1');
const featureAuthV1 = require('./feature/auth-v1');

const env = require('./environment');
const settings = require('./settings');

/**
 * Feature Flags
 */

const useApi = env.FETCHQ_USE_API;
const useConsole = useApi && env.FETCHQ_USE_API;
const useCors = useApi && env.FETCHQ_CORS_ENABLED;

runHookApp({
  settings,
  trace: 'compact',
  services: [
    serviceFetchq,
    ...(useApi ? [serviceJwt] : []),
    ...(useApi ? [serviceFastify] : []),
    ...(useApi ? [serviceFastifyCookie] : []),
    ...(useApi ? [serviceFastifyHealthz] : []),
    ...(useCors ? [serviceFastifyCors] : []),
    ...(useConsole ? [serviceFastifyStatic] : []),
  ],
  features: [
    ...(useApi ? [featureSchemaV1] : []),
    ...(useApi ? [featureFunctionsV1] : []),
    ...(useApi ? [featureApiV1] : []),
    ...(useApi ? [featureAuthV1] : []),
  ],
}).catch((err) => console.error(err.message));

// Let Docker exit on Ctrl+C
process.on('SIGINT', () => process.exit());
