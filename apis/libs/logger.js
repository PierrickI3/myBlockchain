const clc = require('cli-color');

let conf = {
  stackIndex: 1,
  filters: {
    log: clc.black.bgWhite,
    trace: clc.magenta,
    debug: clc.cyan,
    info: clc.green,
    warn: clc.yellow,
    error: clc.redBright.bold,
  },
  format: [
    '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})', //default format
    {
      error: '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}', // error format
    },
  ],
  dateformat: 'isoUtcDateTime',
  preprocess: function (data) {
    data.title = data.title.toUpperCase();
  },
};

// const logger = require('tracer').colorConsole({
//   stackIndex: 1,
// });

const logger = require('tracer').console(conf);

module.exports.debug = (message) => {
  logger.debug(message);
};

module.exports.info = (message) => {
  logger.info(message);
};

module.exports.warn = (message) => {
  logger.warn(message);
};

module.exports.error = (message, error) => {
  if (error) {
    logger.error(error);
  }
  if (message) {
    logger.error(message);
  }
};
