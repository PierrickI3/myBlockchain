"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const endpoint_config_1 = require("../config/endpoint.config");
const Web3 = require('web3');
const provider = `${endpoint_config_1.config.web3_provider_host}:${endpoint_config_1.config.web3_provider_port}`;
const web3 = new Web3(new Web3.providers.HttpProvider(provider));
exports.default = web3;
//# sourceMappingURL=utility.js.map