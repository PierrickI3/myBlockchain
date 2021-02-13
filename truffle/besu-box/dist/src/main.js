"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const endpoint_config_1 = require("./config/endpoint.config");
const morgan = require("morgan");
const helmet = require("helmet");
const { port } = endpoint_config_1.config;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(helmet());
    app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'));
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map