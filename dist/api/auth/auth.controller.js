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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const custom_request_data_decorator_1 = require("../../decorators/custom_request_data.decorator");
const user_decorator_1 = require("../../decorators/user.decorator");
const response_interceptor_1 = require("../../interceptors/response.interceptor");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const refresh_dto_1 = require("./dto/refresh.dto");
const access_token_response_1 = require("./responses/access_token.response");
const refresh_token_response_1 = require("./responses/refresh_token.response");
const base64_util_1 = require("../../utils/base64.util");
const token_dto_1 = require("./dto/token.dto");
const error_response_1 = require("./responses/error.response");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async getAccessToken(generateTokenPayload, accessToken, host, url) {
        if (generateTokenPayload.grant_type === 'refresh_token')
            return await this.refresh(generateTokenPayload, accessToken, host, url);
        const token = base64_util_1.base64.decode(accessToken.split(' ')[1]);
        const [username, password] = token.split(':');
        return await this.login({ password, username }, host, url);
    }
    async login(loginBody, host, url) {
        return await this.authService.login(loginBody, host, url);
    }
    async refresh(refreshBody, accessToken, host, url) {
        return await this.authService.refresh(refreshBody.refresh_token, accessToken.split(' ')[1], host, url);
    }
    async logout(accessToken, user) {
        return {
            message: 'Deleted successfully.',
            result: await this.authService.logout(accessToken, user),
        };
    }
    async verify(accessToken, user) {
        await this.authService.verify(accessToken.split(' ')[1], user);
        return { result: null };
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBasicAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOkResponse)({
        status: 200,
        description: 'Logged in successfully',
        type: access_token_response_1.AccessTokenResponse,
    }),
    (0, swagger_1.ApiOkResponse)({
        status: 200,
        description: 'Access token is refresh successfully',
        type: refresh_token_response_1.RefreshTokenResponse,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        status: 401,
        description: 'Credentials do not match.',
        type: error_response_1.ErrorResponse,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        status: 400,
        description: 'Bad request',
        type: error_response_1.ErrorResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, custom_request_data_decorator_1.ExtractKeyFromRequest)('hostname')),
    __param(3, (0, custom_request_data_decorator_1.ExtractKeyFromRequest)('originalUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [token_dto_1.TokenDTO, String, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAccessToken", null);
__decorate([
    __param(0, (0, common_1.Body)()),
    __param(1, (0, custom_request_data_decorator_1.ExtractKeyFromRequest)('hostname')),
    __param(2, (0, custom_request_data_decorator_1.ExtractKeyFromRequest)('originalUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, custom_request_data_decorator_1.ExtractKeyFromRequest)('hostname')),
    __param(3, (0, custom_request_data_decorator_1.ExtractKeyFromRequest)('originalUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_dto_1.RefreshDTO, String, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOkResponse)({
        status: 200,
        description: 'Deleted successfully',
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        status: 401,
        description: 'Unauthorized.',
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: 403,
        description: 'Access denied.',
    }),
    (0, common_1.UseInterceptors)(response_interceptor_1.TransformResponseInterceptor),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('verify'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOkResponse)({
        status: 200,
        description: 'Success.',
        type: refresh_token_response_1.RefreshTokenResponse,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        status: 401,
        description: 'Unauthorized.',
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        status: 403,
        description: 'Access denied.',
    }),
    (0, common_1.UseInterceptors)(response_interceptor_1.TransformResponseInterceptor),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('token'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map