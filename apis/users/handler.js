//#region Requires

const ResponseHelper = require('../libs/response-helper');
const RequestHelper = require('../libs/request-helper');
const Users = require('./libs/users');

//#endregion

module.exports.getUser = async (event) => {
  try {
    const username = RequestHelper.getPathParameter(event, 'username', undefined);
    const orgName = RequestHelper.getPathParameter(event, 'orgName', undefined);

    let isUserRegisteredResponse = await Users.get(username, orgName);
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

    const orgName = RequestHelper.getPathParameter(event, 'orgName', undefined);
    if (!orgName) {
      throw new Error('Missing orgName');
    }

    //#endregion

    let response = await Users.create(username, orgName);
    return ResponseHelper.success(response);
  } catch (error) {
    return RequestHelper.handleError(error, true);
  }
};

// module.exports.updateAsset = async (event) => {
//   try {
//     const id = RequestHelper.getPathParameter(event, 'id', undefined);
//     const body = RequestHelper.getBody(event);
//     const value = body.value;

//     let asset = new Asset();
//     let response = await asset.update(id, value);
//     return ResponseHelper.success(response);
//   } catch (error) {
//     return RequestHelper.handleError(error, true);
//   }
// };

// module.exports.deleteAsset = async (event) => {
//   try {
//     const id = RequestHelper.getPathParameter(event, 'id', undefined);

//     let asset = new Asset();
//     let response = await asset.delete(id);
//     return ResponseHelper.success(response);
//   } catch (error) {
//     return RequestHelper.handleError(error, true);
//   }
// };
