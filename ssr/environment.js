/**
 * ENVIRONMENT VARIABLES
 * =====================
 *
 * This module has the responsibility to list, document and validate the
 * environmental variable that regulate the app's behavior.
 *
 */

const envalid = require('envalid');
const { generate: randomPassword } = require('generate-password');

const isDev = ['development1', 'test1'].includes(process.env.NODE_ENV);
const getRandomSecret = () =>
  isDev
    ? 'fetchq-console'
    : randomPassword({
        length: 50,
        numbers: true,
      });

const env = envalid.cleanEnv(process.env, {
  // PostgreSQL connection string:
  // > those variables are used in this order of priority
  FETCHQ_PGSTRING: envalid.str({ default: '' }),
  DATABASE_URL: envalid.str({ default: '' }),
  PGSTRING: envalid.str({ default: '' }),
  GITPOD_PGSTRING: envalid.str({
    default: 'postgres://gitpod:gitpod@localhost:5432/postgres',
  }),

  // PostgreSQL Settings:
  PG_POOL_MAX: envalid.num({ default: 5 }),
  PG_USE_SSL: envalid.bool({ default: false }),

  // Fetchq Maintenance:
  FETCHQ_MAINTENANCE_DELAY: envalid.num({ default: 1000 }),
  FETCHQ_MAINTENANCE_SLEEP: envalid.num({ default: 1000 }),

  // Fetchq App Settings:
  FETCHQ_CONSOLE_PASSWORD: envalid.str({ default: '' }),
  FETCHQ_AUTH_HEADER_NAME: envalid.str({ default: 'authorization' }),
  FETCHQ_AUTH_QUERY_NAME: envalid.str({ default: 'auth' }),
  FETCHQ_AUTH_COOKIE_NAME: envalid.str({ default: 'auth' }),
  FETCHQ_AUTH_COOKIE_SECRET: envalid.str({ default: getRandomSecret() }),
  FETCHQ_JWT_SECRET: envalid.str({ default: getRandomSecret() }),

  // Service port on which expose the API and the app:
  FETCHQ_PORT: envalid.num({ default: null }),
  PORT: envalid.num({ default: null }),

  // CORS Settings
  FETCHQ_CORS_ENABLED: envalid.bool({ default: false }),
  FETCHQ_CORS_ORIGIN: envalid.url({ default: 'http://localhost:3000' }),

  // Main feature flags
  FETCHQ_USE_API: envalid.bool({ default: true }),
  FETCHQ_USE_CONSOLE: envalid.bool({ default: true }),
});

module.exports = { ...env };
