# Fetchq Console

Hello friend,  
and welcome to **Fetchq Console**, the App that let you easily manage a Fetchq instance, and discover the documents in it.

## Deploy it on Heroku

Are you curious to try this out?  
Here is the answer: Heroku lets you run Fetchq for free.  
**FOR FREE**.

Just click on the following link to have your App up and running in a few minutes:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/fetchq/console/tree/main)

## Cloud Development

Do you want to contribute?  
Wait no more: GitPod lets you run the entire development environment from your browser.  
**FOR FREE**.

Just click on the following button and have fun hacking the Console around. Don't forget to open a PR when you are happy with your work 😎.

[![Open in GitPod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io#https://github.com/fetchq/console)

## Local Development

```bash
PGSTRING=postgres://... \
NODE_ENV=development \

npm install
npm start
```

Or with docker:

```bash
# Install or update NPM & Docker dependencies:
make install

# Start the service:
make start

# Stop the service:
make stop

# Run a complete series of tests:
# (run this in a different terminal)
make test
```

Configure the host's ports via `.env`:

```bash
PG_PORT=5432
WEBAPP_PORT=8080
```

## Environment Variables

| name                    | type   | description                                                                           |
| ----------------------- | ------ | ------------------------------------------------------------------------------------- |
| FETCHQ_PORT             | number | Fastify's service port. It falls back on `PORT` and `8080`                            |
| FETCHQ_PG_STRING        | string | Postgres connection string. It falls back on `DATABASE_URL`, `PGSTRING`               |
| FETCHQ_CONSOLE_PASSWORD | string | setup a password to access the console                                                |
| FETCHQ_ENABLE_CONSOLE   | bool   | set it to `false` to disable the web interface. default: `true`                       |
| FETCHQ_ENABLE_CORS      | bool   | set it to `true` to enable CORS. default `false` (enabled for `NODE_ENV=development`) |
| FETCHQ_CORS_ORIGIN      | string | it allows such origin to make CORS requests to the api                                |

## Testing

Run tests:

```bash
npm run test:unit
npm run test:client
npm run test:e2e
```

Work a _test driven session_:

```bash
npm run tdd:unit
npm run tdd:client
npm run tdd:e2e
```

**NOTE:** the `e2e` tests are executed agains the running API and reset the the target
database at every run.

## On dynamic utilization of "getConfig()"

In this project I'm using `request.getConfig()` to access the Hook's app context and
configuration at runtime inside request handlers and preHandlers.

There are 2 main downsides of this choice:

1. In case of misspell, the error won't be catched until a particular request gets executed
2. Performances: each requests must resolve the stringified object notation

**Why do I do this?**

Testability. By using runtime configuration, I can change values at will
from the test case:

```test
reset = mockAppSetting('prop.path', 'value')
...runMyTest...
reset()
```

By instance, this technique is being used to test the authentication
with and without a password. If I did use static settings, that won't
really be possible.

**Mitigation of risks**

I use extensive E2E test coverage to mitigate the probability of
misspelled setting strings to hit production. I do my best to try every
dynamic configuration scenario.

**Regarding Performances**

Although it is true that resolving the stringified path for each request
is a hit on performances, it is not a big deal.

I can also improve this by memoizing the value in ForrestJS Hook's
module for production, or simply momoizing it and invalidate it once
the `setter` is being executed.

This is a console app that provides admin interface to manage a Fetchq
cluster, it is not a production-critical app and it is meant to be
used by few administrators or developers. I can't imagine this small
performance detail becoming a big issue ever.
