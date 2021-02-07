//#region Requires

const ResponseHelper = require('./response-helper');
const logger = require('./logger');

//#endregion

module.exports.getPathParameter = function (event, parameter, defaultValue) {
  return event.pathParameters && Object.keys(event.pathParameters).includes(parameter) ? event.pathParameters[parameter] : defaultValue;
};

module.exports.getQueryStringParameter = function (event, parameter, defaultValue) {
  return event.queryStringParameters && Object.keys(event.queryStringParameters).includes(parameter) ? event.queryStringParameters[parameter] : defaultValue;
};

module.exports.getBody = function (event) {
  if (event && Object.keys(event).includes('body') && event.body) {
    if (typeof event.body === 'string') {
      return JSON.parse(event.body);
    } else {
      return event.body;
    }
  } else {
    return undefined;
  }
};

module.exports.getAuthorizationHeader = function (event) {
  if (event && Object.keys(event).includes('headers')) {
    return event.headers.Authorization || event.headers.authorization;
  } else {
    return undefined;
  }
};

module.exports.handleError = function (error, returnJSONResponse = false, condition) {
  if (typeof error === 'string') {
    // Generic Error message
    logger.error(null, error);
    if (returnJSONResponse) {
      if (condition && condition.keywords) {
        if (error.indexOf(condition.keywords) !== -1) {
          return ResponseHelper.generic(condition.returnStatusCode, { message: error });
        }
      }
      if (error.toLowerCase().indexOf('not found') !== -1) {
        return ResponseHelper.notFound();
      }
      return ResponseHelper.failure({ message: error });
    }
    return error;
  } else {
    // AWS Error
    if (Object.keys(error).includes('code')) {
      switch (error.code) {
        case 'ResourceNotFoundException':
          return ResponseHelper.notFound();
        case 'NotAuthorizedException':
        default:
          return ResponseHelper.generic(400, { message: error.message });
      }
    }

    // Exception
    if (error.message) {
      logger.error(error.message);
      return ResponseHelper.failure({ message: error.message });
    }

    // API Error Response
    if (error.response && error.response.data && error.response.status) {
      logger.error(null, error.response.data);
      logger.error(null, error.response.data && Object.keys(error.response.data).length > 0 ? error.response.data.message : error.response.statusText);
      return ResponseHelper.generic(error.response.status, { message: error.response.data && Object.keys(error.response.data).length > 0 ? error.response.data.message : error.response.statusText });
    } else if (error.hasOwnProperty('statusCode')) {
      logger.info('Parsing error.body...');
      return ResponseHelper.generic(error.statusCode, error.body ? JSON.parse(error.body) : '');
    } else {
      return ResponseHelper.failure(error);
    }
  }
};
