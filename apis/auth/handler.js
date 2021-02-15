//#region Requires

const ResponseHelper = require('../libs/response-helper');
const RequestHelper = require('../libs/request-helper');
const Auth = require('./libs/auth');

//#endregion

module.exports.auth = async (event) => {
  try {
    const { org, username } = RequestHelper.getBody(event);
    if (!username) {
      throw new Error('Missing username');
    }
    if (!org) {
      throw new Error('Missing org');
    }

    let authResponse = await Auth.auth(username, org);
    return ResponseHelper.success(authResponse);
  } catch (error) {
    return RequestHelper.handleError(error, true);
  }
};
