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
exports.AccessTokenResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
class AccessTokenResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Access token' }),
    __metadata("design:type", String)
], AccessTokenResponse.prototype, "access_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Token type', default: 'Bearer' }),
    __metadata("design:type", String)
], AccessTokenResponse.prototype, "token_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The expiry time' }),
    __metadata("design:type", Number)
], AccessTokenResponse.prototype, "expires_in", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The refresh token' }),
    __metadata("design:type", String)
], AccessTokenResponse.prototype, "refresh_token", void 0);
exports.AccessTokenResponse = AccessTokenResponse;
//# sourceMappingURL=access_token.response.js.map