console.log('Starting Fetchq CONSOLE API...');
require('dotenv').config();
const { runHookApp } = require('@forrestjs/hooks');

/**
 * Services
 */
console.log('Loading services...');
const serviceFetchq = require('@forrestjs/service-fetchq');
const serviceFastify = require('@forrestjs/service-fastify');
const serviceFastifyCors = require('@forrestjs/service-fastify-cors');
const serviceFastifyStatic = require('@forrestjs/service-fastify-static');
const serviceFastifyCookie = require('@forrestjs/service-fastify-cookie');
const serviceFastifyJwt = require('@forrestjs/service-fastify-jwt');
const serviceFastifyFetchq = require('@forrestjs/service-fastify-fetchq');
const serviceFastifyHealthz = require('@forrestjs/service-fastify-healthz');
const serviceTdd = require('./service/service-tdd');

/**
 * Features
 */

console.log('Loading features...');
const featureSchemaV1 = require('./feature/schema-v1');
const featureApiV1 = require('./feature/api-v1');
const featureAuthV1 = require('./feature/auth-v1');

console.log('Loading environment & settings...');
const env = require('./environment');
const settings = require('./settings');

/**
 * Feature Flags
 */

const useApi = env.FETCHQ_USE_API;
const useConsole = useApi && env.FETCHQ_USE_API;
const useCors = useApi && env.FETCHQ_CORS_ENABLED;

console.log('Booting ForrestJS App...');
runHookApp({
  settings,
  trace: 'compact',
  services: [
    serviceFetchq,
    ...(useApi ? [serviceFastify] : []),
    ...(useApi ? [serviceFastifyCookie] : []),
    ...(useApi ? [serviceFastifyJwt] : []),
    ...(useApi ? [serviceFastifyHealthz] : []),
    ...(useCors ? [serviceFastifyCors] : []),
    ...(useConsole ? [serviceFastifyStatic] : []),
    ...(useApi ? [serviceFastifyFetchq] : []),
    serviceTdd,
  ],
  features: [
    ...(useApi ? [featureSchemaV1] : []),
    ...(useApi ? [featureApiV1] : []),
    ...(useApi ? [featureAuthV1] : []),
  ],
}).catch((err: any) => console.error(err.message));

// Let Docker exit on Ctrl+C
process.on('SIGINT', () => process.exit());
