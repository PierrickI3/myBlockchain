//#region Requires

const ResponseHelper = require('../libs/response-helper');
const RequestHelper = require('../libs/request-helper');
const Asset = require('./libs/Asset');

//#endregion

module.exports.getAsset = async (event) => {
  try {
    const id = RequestHelper.getPathParameter(event, 'id', undefined);

    let asset = new Asset();
    let response = await asset.get(id);
    return ResponseHelper.success(response);
  } catch (error) {
    return RequestHelper.handleError(error, true);
  }
};

module.exports.createAsset = async (event) => {
  try {
    let body = RequestHelper.getBody(event);
    const { id, value } = body;

    let asset = new Asset();
    let response = await asset.create(id, value);
    return ResponseHelper.success(response);
  } catch (error) {
    return RequestHelper.handleError(error, true);
  }
};

module.exports.updateAsset = async (event) => {
  try {
    const id = RequestHelper.getPathParameter(event, 'id', undefined);
    const body = RequestHelper.getBody(event);
    const value = body.value;

    let asset = new Asset();
    let response = await asset.update(id, value);
    return ResponseHelper.success(response);
  } catch (error) {
    return RequestHelper.handleError(error, true);
  }
};

module.exports.deleteAsset = async (event) => {
  try {
    const id = RequestHelper.getPathParameter(event, 'id', undefined);

    let asset = new Asset();
    let response = await asset.delete(id);
    return ResponseHelper.success(response);
  } catch (error) {
    return RequestHelper.handleError(error, true);
  }
};
