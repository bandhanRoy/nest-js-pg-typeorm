"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const express_1 = require("express");
const helmet_1 = require("helmet");
const http_proxy_middleware_1 = require("http-proxy-middleware");
const app_module_1 = require("./app.module");
const app_insight_1 = require("./config/app-insight");
const logger_1 = require("./config/logger");
const morgan_1 = require("./config/morgan");
const swagger_2 = require("./config/swagger");
const common_constants_1 = require("./constants/common.constants");
const global_exception_handler_1 = require("./handlers/global_exception.handler");
const lms_proxy_service_1 = require("./api/lms_proxy/lms_proxy.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: logger_1.logger,
        cors: true,
    });
    const httpAdapter = app.get(core_1.HttpAdapterHost);
    const configService = app.get(config_1.ConfigService);
    const lmsProxyService = app.get(lms_proxy_service_1.LmsProxyService);
    (0, app_insight_1.startAppInsight)(configService);
    app.setGlobalPrefix(common_constants_1.ROUTE_VERSION + '/' + common_constants_1.ROUTE_BASE_PATH);
    const document = swagger_1.SwaggerModule.createDocument(app, swagger_2.swaggerConfig);
    swagger_1.SwaggerModule.setup('/docs', app, document, {
        useGlobalPrefix: true,
    });
    app.use(morgan_1.requestLogger);
    app.useGlobalFilters(new global_exception_handler_1.GlobalExceptionHandler(httpAdapter, configService));
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.use((0, helmet_1.default)());
    app.use((0, express_1.urlencoded)({ extended: false }));
    app.use(`/${common_constants_1.ROUTE_VERSION}/${common_constants_1.ROUTE_BASE_PATH}/lms`, (0, http_proxy_middleware_1.createProxyMiddleware)(lmsProxyService.filter, lmsProxyService));
    const port = Number(configService.get('APP_PORT') || 3000);
    await app.listen(port);
    logger_1.logger.log(`Server started successfully as ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map