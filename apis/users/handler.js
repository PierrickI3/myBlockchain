//#region Requires

const ResponseHelper = require('../libs/response-helper');
const RequestHelper = require('../libs/request-helper');
const Users = require('./libs/users');

//#endregion

module.exports.getUsers = async (event) => {
  try {
    const org = RequestHelper.getPathParameter(event, 'org', undefined);

    let usersResponse = await Users.getAll(org);
    console.log('Response:', usersResponse);
    return ResponseHelper.success(usersResponse);
  } catch (error) {
    return RequestHelper.handleError(error, true);
  }
};

module.exports.getUser = async (event) => {
  try {
    const username = RequestHelper.getPathParameter(event, 'username', undefined);
    const org = RequestHelper.getPathParameter(event, 'org', undefined);

    let isUserRegisteredResponse = await Users.get(username, org);
    console.log('Response:', isUserRegisteredResponse);
    return isUserRegisteredResponse ? ResponseHelper.success(isUserRegisteredResponse) : ResponseHelper.notFound();
  } catch (error) {
    return RequestHelper.handleError(error, true);
  }
};

module.exports.createUser = async (event) => {
  try {
    //#region Parameters

    let body = RequestHelper.getBody(event);

    const { username } = body;
    if (!username) {
      throw new Error('Missing username');
    }

    const org = RequestHelper.getPathParameter(event, 'org', undefined);
    if (!org) {
      throw new Error('Missing org');
    }

    //#endregion

    let response = await Users.create(username, org);
    return ResponseHelper.success(response);
  } catch (error) {
    return RequestHelper.handleError(error, true);
  }
};

module.exports.deleteUser = async (event) => {
  try {
    const org = RequestHelper.getPathParameter(event, 'org', undefined);
    if (!org) {
      throw new Error('Missing org');
    }

    const username = RequestHelper.getPathParameter(event, 'username', undefined);
    if (!username) {
      throw new Error('Missing username');
    }

    await Users.delete(username, org);
    return ResponseHelper.noContent();
  } catch (error) {
    return RequestHelper.handleError(error, true);
  }
};
