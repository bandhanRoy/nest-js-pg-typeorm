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
exports.Jwt = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const fs = require("fs");
const date_time_util_1 = require("../utils/date_time.util");
let Jwt = class Jwt {
    constructor(configService, jwtService) {
        this.configService = configService;
        this.jwtService = jwtService;
        this.storeSSLKeyData = {};
    }
    encode(payload, host, url) {
        var _a;
        const expiresIn = Number((0, date_time_util_1.updateDateTime)(new Date(), this.configService.get('JWT_EXPIRES_IN'), 2, 'h').format('X'));
        const accessToken = this.jwtService.sign({
            email: payload.email,
            userId: payload.uid,
        }, {
            secret: this.getKeyData(this.configService.get('PVT_KEY')),
            algorithm: 'RS256',
            issuer: host + url,
            audience: host,
            subject: payload.uid,
            mutatePayload: String(this.configService.get('JWT_MUTATE_PAYLOAD')) === 'true'
                ? true
                : false,
            noTimestamp: String(this.configService.get('JWT_NO_TIMESTAMP')) === 'true'
                ? true
                : false,
            expiresIn: (_a = this.configService.get('JWT_EXPIRES_IN')) !== null && _a !== void 0 ? _a : 7200,
        });
        return { accessToken, expiresIn };
    }
    verify(token) {
        return this.jwtService.verify(token, {
            secret: this.getKeyData(this.configService.get('PUB_KEY')),
        });
    }
    decode(token) {
        return this.jwtService.decode(token);
    }
    getKeyData(keyPath) {
        const storedData = this.storeSSLKeyData[keyPath];
        if (!storedData) {
            const data = fs.readFileSync(keyPath, 'utf8');
            this.storeSSLKeyData[keyPath] = data;
            return data;
        }
        return storedData;
    }
};
Jwt = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        jwt_1.JwtService])
], Jwt);
exports.Jwt = Jwt;
//# sourceMappingURL=jwt.js.map