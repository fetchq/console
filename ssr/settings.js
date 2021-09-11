/**
 * App's Settings Configuration
 * ============================
 *
 * This function gets executed at boot time and should provide a comprehensive
 * set of all the needed configuration.
 *
 * It should eagerly crash and apply static checks to any environment configuration
 * that should be provided at boot time.
 */

const path = require('path');
const env = require('./environment');

module.exports = ({ setConfig, getConfig }) => {
  // TODO: add envalid

  // FetchQ Client
  setConfig('fetchq', {
    connectionString:
      env.FETCHQ_PGSTRING || // Explicit setup
      env.DATABASE_URL || // Heroku
      env.PGSTRING || // Default fetchq client
      env.GITPOD_PGSTRING,
    pool: {
      max: env.PG_POOL_MAX,
      // needed by Heroku but not locally
      ...(env.PG_USE_SSL ? { ssl: { rejectUnauthorized: false } } : {}),
    },
    maintenance: {
      limit: 1, // TODO: need to update fetchq-client so to avoid maintenance running
      delay: env.FETCHQ_MAINTENANCE_DELAY,
      sleep: env.FETCHQ_MAINTENANCE_SLEEP,
    },
  });

  // Generica app configuration
  // setConfig('app.q1.name', Q1);
  setConfig('app.logs.page.size', 100);
  // Authorization setup
  setConfig('app.auth.console.password', env.FETCHQ_CONSOLE_PASSWORD || null);
  setConfig('app.auth.cookie.name', env.FETCHQ_AUTH_COOKIE_NAME);
  setConfig('app.auth.query.param', env.FETCHQ_AUTH_QUERY_NAME);
  setConfig('app.auth.header.name', env.FETCHQ_AUTH_HEADER_NAME);
  setConfig('app.auth.jwt.scope', env.FETCHQ_JWT_SCOPE);

  // Heroku compatible port environment variable
  setConfig('fastify.port', env.FETCHQ_PORT || env.PORT || '8080');

  setConfig('fastify.instance.options', {
    logger: false,
    ignoreTrailingSlash: true,
  });

  // Setup static files from CRA's build folder
  setConfig('fastify.static', {
    root: path.join(__dirname, '..', 'build'),
  });

  setConfig('fastify.cookie', {
    secret: env.FETCHQ_AUTH_COOKIE_SECRET,
    options: {
      httpOnly: true,
      secure: true,
      path: '/',
    },
  });

  setConfig('fastify.jwt', {
    secret: env.FETCHQ_JWT_SECRET,
  });

  // TODO: cors should be enabled only on demand
  //       need to better figure out the environment based configuration
  setConfig('fastify.cors', {
    origin: process.env.FETCHQ_CORS_ORIGIN,
    credentials: true,
  });
};
