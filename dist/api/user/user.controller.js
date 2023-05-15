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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const response_interceptor_1 = require("../../interceptors/response.interceptor");
const create_user_dto_1 = require("./dto/create-user.dto");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async create(createUserDto) {
        await this.userService.create(createUserDto);
        return {
            statusCode: 201,
            message: 'User added successfully',
            result: null,
        };
    }
    async activateLogin(token) {
        const result = await this.userService.activateLogin(token);
        if (!result)
            throw new common_1.UnauthorizedException('Unauthorized');
        return {
            statusCode: 201,
            message: 'User activated successfully',
            result: null,
        };
    }
};
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOkResponse)({
        status: 201,
        description: 'User added successfully',
    }),
    (0, swagger_1.ApiConflictResponse)({
        status: 409,
        description: 'User already exists.',
    }),
    (0, common_1.UseInterceptors)(response_interceptor_1.TransformResponseInterceptor),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('activate'),
    (0, swagger_1.ApiOkResponse)({
        status: 200,
        description: 'User activated successfully',
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        status: 401,
        description: 'Unauthorized.',
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "activateLogin", null);
UserController = __decorate([
    (0, common_1.Controller)('user'),
    (0, swagger_1.ApiTags)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map