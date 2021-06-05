const fastifyTestUtils = require('@forrestjs/service-fastify/test/globals');
const fetchqTestUtils = require('@forrestjs/service-fetchq/test/globals');
const jwtTestUtils = require('@forrestjs/service-jwt/test/globals');

// Fastify provides the basic global functions that make
// E2E testing very easy.
//
// It's likely that other services utility functions will
// depend upon this basic package.
//
// If you want/need to override any of the utilities that
// are provided by Fastify, just pass here an object with
// your custom implementation of the specific method.
const fastifyGlobals = fastifyTestUtils({
  // pause: () => { ... my custom implementation ... }
});

module.exports = () => ({
  ...fastifyGlobals,
  ...fetchqTestUtils(fastifyGlobals),
  ...jwtTestUtils(fastifyGlobals),
});


// const axios = require('axios');
// const env = require('./jest.env')();

// const pause = (delay = 0) => new Promise((r) => setTimeout(r, delay));

// const statusCheck = async (endpoint, test) => {
//   try {
//     const res = await axios.get(endpoint);
//     console.log(res.data);
//     return test(res);
//   } catch (err) {
//     return false;
//   }
// };

// const serverIsUp = async (prefix) => {
//   console.info(`[${prefix}] await for server's health check...`);
//   console.info(`[${prefix}] ${env.TEST_STATUS_CHECK_URL}`);

//   let isup = false;
//   while (isup === false) {
//     await pause(env.TEST_STATUS_CHECK_INTERVAL);
//     isup = await statusCheck(
//       env.TEST_STATUS_CHECK_URL,
//       (res) => res.status === 200,
//     );
//   }

//   console.info(`[${prefix}] server is up...`);
// };

// const getAppConfig = async (path) =>
//   (await axios.get(`${env.TEST_SERVER_ROOT}/test/config?path=${path}`)).data;

// const setAppConfig = async (path, value) =>
//   (await axios.post(`${env.TEST_SERVER_ROOT}/test/config`, { path, value }))
//     .data;

// const mockAppConfig = async (path, value) => {
//   const originalValue = await getAppConfig(path);
//   await setAppConfig(path, value);
//   return () => setAppConfig(path, originalValue);
// };

// const info = (data) => console.info(JSON.stringify(data, null, 2));

// const query = async (query) => {
//   try {
//     return (await axios.post(`${env.TEST_SERVER_ROOT}/test/query`, { query }))
//       .data;
//   } catch (err) {
//     throw new Error(`${err.response.status} - ${err.response.data}`);
//   }
// };

// const resetSchema = async () =>
//   (await axios.post(`${env.TEST_SERVER_ROOT}/test/state/reset`, { query }))
//     .data;

// const http = {
//   get: async (uri) => (await axios.get(`${env.TEST_SERVER_ROOT}${uri}`)).data,
//   delete: async (uri) =>
//     (await axios.delete(`${env.TEST_SERVER_ROOT}${uri}`)).data,
//   post: async (uri, data = {}) => {
//     try {
//       return (await axios.post(`${env.TEST_SERVER_ROOT}${uri}`, data)).data;
//     } catch (err) {
//       // console.log(err.response.data);
//       throw err;
//     }
//   },
//   put: async (uri, data = {}) =>
//     (await axios.put(`${env.TEST_SERVER_ROOT}${uri}`, data)).data,
// };

// const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// const randomItem = (items) => items[random(0, items.length - 1)];

// module.exports = () => ({
//   env: { ...env },
//   axios,
//   pause,
//   statusCheck,
//   serverIsUp,
//   getAppConfig,
//   setAppConfig,
//   mockAppConfig,
//   info,
//   query,
//   resetSchema,
//   random,
//   randomItem,
//   ...http,
// });
