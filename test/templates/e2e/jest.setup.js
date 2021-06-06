const global = require('./jest.globals')();
module.exports = async () => {
    await global.awaitTestReady();
    await global.fetchq.resetState();
    await global.pause(250);
};
