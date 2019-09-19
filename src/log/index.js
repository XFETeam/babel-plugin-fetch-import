const debug = require('debug')('babel-plugin-fetch-import');

const createLog = enable => (message) => {
  if (enable) {
    debug(message);
  }
};

module.exports = createLog;
