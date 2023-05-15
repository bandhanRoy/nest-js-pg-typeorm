"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionHandler = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const logger_1 = require("../config/logger");
let GlobalExceptionHandler = class GlobalExceptionHandler {
    constructor(httpAdapterHost, configService) {
        this.httpAdapterHost = httpAdapterHost;
        this.configService = configService;
    }
    catch(exception, host) {
        var _a, _b;
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        let httpStatus = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error occurred';
        const request = ctx.getRequest();
        const isDevEnv = this.configService.get('ENV') === 'DEV' ||
            this.configService.get('ENV') === 'LOCAL';
        let errors = null;
        if (exception instanceof common_1.HttpException) {
            httpStatus = exception.getStatus();
            message = exception.message || ((_a = exception.message) === null || _a === void 0 ? void 0 : _a['error']);
            errors = ((_b = exception.getResponse()) === null || _b === void 0 ? void 0 : _b['message']) || null;
        }
        const responseBody = {
            statusCode: httpStatus,
            message,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(request),
            errors,
        };
        isDevEnv &&
            request.query['debug'] === 'true' &&
            (responseBody['errorInfo'] = exception === null || exception === void 0 ? void 0 : exception['stack']);
        logger_1.logger.error(`${this.constructor.name}.catch Error occurred details: ${JSON.stringify({
            method: request.method,
            url: request.originalUrl,
            formattedErrResponse: responseBody,
            errStack: exception === null || exception === void 0 ? void 0 : exception['stack'],
        })}`);
        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
};
GlobalExceptionHandler = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [core_1.HttpAdapterHost,
        config_1.ConfigService])
], GlobalExceptionHandler);
exports.GlobalExceptionHandler = GlobalExceptionHandler;
//# sourceMappingURL=global_exception.handler.js.map