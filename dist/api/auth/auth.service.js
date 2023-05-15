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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = require("bcrypt");
const typeorm_2 = require("typeorm");
const user_service_1 = require("../../api/user/user.service");
const jwt_1 = require("../../config/jwt");
const crypto_util_1 = require("../../utils/crypto.util");
const date_time_util_1 = require("../../utils/date_time.util");
const auth_entity_1 = require("./entities/auth.entity");
const uuid_1 = require("uuid");
let AuthService = class AuthService {
    constructor(authRepository, userService, jwt, configService) {
        this.authRepository = authRepository;
        this.userService = userService;
        this.jwt = jwt;
        this.configService = configService;
    }
    async login(loginDto, host, url) {
        const userDetails = await this.userService.getUserDetails({
            where: {
                email: loginDto.username,
                deletedAt: null,
                isActive: true,
            },
        });
        if (!userDetails)
            throw new common_1.UnauthorizedException('Credentials do not match');
        const isMatched = await bcrypt.compare(loginDto.password, userDetails.password);
        if (!isMatched)
            throw new common_1.UnauthorizedException('Credentials do not match');
        const currDateTime = new Date();
        const { accessToken: access_token, expiresIn: access_token_expires_in } = this.jwt.encode(userDetails, host, url);
        const refreshToken = crypto_util_1.cryptoUtil.encrypt((0, uuid_1.v4)());
        const refreshTokenExpiry = Number((0, date_time_util_1.updateDateTime)(currDateTime, this.configService.get('JWT_REFRESH_TOKEN_EXPIRY'), 7, 'd').format('X'));
        const auth = new auth_entity_1.Auth();
        auth.userId = userDetails.uid;
        auth.accessToken = access_token;
        auth.accessTokenExpiresIn = access_token_expires_in;
        auth.refreshToken = refreshToken;
        auth.refreshTokenExpiresIn = refreshTokenExpiry;
        auth.createdBy = userDetails.uid;
        await this.authRepository.save(auth);
        return {
            access_token: access_token,
            token_type: 'Bearer',
            expires_in: access_token_expires_in,
            refresh_token: refreshToken,
        };
    }
    async logout(accessToken, authUserDetails) {
        const update = await this.authRepository.update({
            userId: authUserDetails.userId,
            accessToken: accessToken.split(' ')[1],
            deletedAt: (0, typeorm_2.IsNull)(),
        }, { deletedAt: new Date(), deletedBy: authUserDetails.userId });
        if (!update.affected)
            throw new common_1.InternalServerErrorException('User logout failed');
        return null;
    }
    async refresh(refreshToken, accessToken, host, url) {
        const decodeData = this.jwt.decode(accessToken);
        if (!decodeData)
            throw new common_1.ForbiddenException('Access denied.');
        const userDetails = decodeData;
        const tokenDetails = await this.authRepository.findOne({
            where: {
                refreshToken,
                userId: (0, typeorm_2.Equal)(userDetails.userId),
                deletedAt: null,
            },
        });
        if (!tokenDetails)
            throw new common_1.ForbiddenException('Access denied.');
        if (Number((0, date_time_util_1.currDate)().getTime()) >
            tokenDetails.refreshTokenExpiresIn * 1000)
            throw new common_1.UnauthorizedException('Unauthorized.');
        const user = await this.userService.getUserDetails({
            where: {
                email: userDetails.email,
                deletedAt: null,
            },
        });
        if (!user)
            throw new common_1.ForbiddenException('Access denied.');
        const { accessToken: access_token, expiresIn: access_token_expires_in } = this.jwt.encode(user, host, url);
        const updated = await this.authRepository.update({ id: tokenDetails.id }, {
            accessToken: access_token,
            accessTokenExpiresIn: access_token_expires_in,
            updatedAt: new Date(),
            updatedBy: user.uid,
        });
        if (!updated.affected)
            throw new common_1.InternalServerErrorException('Something went wrong!. Please try again later');
        return {
            access_token: access_token,
            token_type: 'Bearer',
            expires_in: access_token_expires_in,
        };
    }
    async verify(token, user) {
        const tokenDetails = await this.authRepository.findOne({
            where: {
                accessToken: token,
                userId: (0, typeorm_2.Equal)(user.userId),
                deletedAt: null,
            },
        });
        if (!tokenDetails)
            throw new common_1.UnauthorizedException();
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(auth_entity_1.Auth)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService,
        jwt_1.Jwt,
        config_1.ConfigService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map