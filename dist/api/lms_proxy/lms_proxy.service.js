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
exports.LmsProxyService = void 0;
const common_1 = require("@nestjs/common");
const http_proxy_middleware_1 = require("http-proxy-middleware");
const common_constants_1 = require("../../constants/common.constants");
const logger_1 = require("../../config/logger");
const lms_util_1 = require("../../utils/lms.util");
const config_1 = require("@nestjs/config");
let LmsProxyService = class LmsProxyService {
    constructor(configService) {
        this.configService = configService;
        this.token = '';
        this.cookies = [];
        this.target = common_constants_1.API_SERVICE_URL;
        this.changeOrigin = true;
        this.pathRewrite = {
            [`^/${common_constants_1.ROUTE_VERSION}/${common_constants_1.ROUTE_BASE_PATH}/lms/file/private`]: '/Files/Private',
            [`^/${common_constants_1.ROUTE_VERSION}/${common_constants_1.ROUTE_BASE_PATH}/lms/file/public`]: '/Files/Public',
            [`^/${common_constants_1.ROUTE_VERSION}/${common_constants_1.ROUTE_BASE_PATH}/lms`]: '/api/rest/v2',
        };
        this.logLevel = 'debug';
        this.selfHandleResponse = true;
        this.onProxyRes = (0, http_proxy_middleware_1.responseInterceptor)((responseBuffer, proxyRes, req, res) => this.modifyResponse(responseBuffer, proxyRes, req, res));
        this.onProxyReq = (proxyReq, req, res) => this.modifyRequest(proxyReq, req, res);
        this.filter = function (pathname, _req) {
            return !!pathname.match(`^/${common_constants_1.ROUTE_VERSION}/${common_constants_1.ROUTE_BASE_PATH}/lms`);
        };
    }
    logProvider() {
        logger_1.logger['info'] = logger_1.logger['log'];
        return logger_1.logger;
    }
    onError(err, _req, res, _target) {
        logger_1.logger.error(err);
        res.writeHead(500, {
            'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({
            message: 'Something went wrong. And we are reporting a custom error message.',
        }));
    }
    modifyRequest(proxyReq, _req, _res) {
        proxyReq.setHeader('Cookie', this.cookies.join(' '));
        proxyReq.setHeader('X-Absorb-API-Key', this.configService.get('ABSORB_API_KEY'));
        logger_1.logger.log(`Hitting request url: ${common_constants_1.API_SERVICE_URL}${proxyReq.path}`);
        this.token && proxyReq.setHeader('Authorization', 'Bearer ' + this.token);
    }
    async modifyResponse(responseBuffer, proxyRes, req, _res) {
        var _a;
        const exchange = `[DEBUG] ${req.method} ${req.path} -> ${proxyRes === null || proxyRes === void 0 ? void 0 : proxyRes['req'].protocol}//${proxyRes === null || proxyRes === void 0 ? void 0 : proxyRes['req'].host}${proxyRes === null || proxyRes === void 0 ? void 0 : proxyRes['req'].path} [${proxyRes.statusCode}]`;
        logger_1.logger.debug(exchange);
        if ((_a = proxyRes.headers) === null || _a === void 0 ? void 0 : _a['set-cookie']) {
            proxyRes.headers['set-cookie'].forEach((eCookie) => {
                const cookie = eCookie.split(' path=/; secure; HttpOnly').join('');
                !this.cookies.includes(cookie) &&
                    this.cookies.push(eCookie.split(' path=/; secure; HttpOnly').join(''));
            });
        }
        if (proxyRes.headers['content-type'] === 'application/hal+json') {
            const response = responseBuffer.toString('utf8');
            proxyRes.headers['content-type'] = 'application/json';
            const resBody = JSON.parse(response);
            if (resBody.token) {
                this.token = resBody.token;
                this.cookies.push(`jwtToken=${this.token};`);
            }
            const formattedData = (0, lms_util_1.cleanUpResponse)(resBody);
            return JSON.stringify(formattedData);
        }
        return responseBuffer;
    }
};
LmsProxyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LmsProxyService);
exports.LmsProxyService = LmsProxyService;
//# sourceMappingURL=lms_proxy.service.js.map