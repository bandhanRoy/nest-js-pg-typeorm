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
exports.TokenDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var GrantType;
(function (GrantType) {
    GrantType["client_credentials"] = "client_credentials";
    GrantType["refresh_token"] = "refresh_token";
})(GrantType || (GrantType = {}));
class TokenDTO {
}
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.grant_type === 'refresh_token'),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Refresh token that is returned when user logs in',
        required: false,
    }),
    __metadata("design:type", String)
], TokenDTO.prototype, "refresh_token", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Grant type of the token',
        required: true,
        enum: GrantType,
        enumName: 'GrantType',
    }),
    (0, class_validator_1.IsEnum)(['client_credentials', 'refresh_token']),
    __metadata("design:type", String)
], TokenDTO.prototype, "grant_type", void 0);
exports.TokenDTO = TokenDTO;
//# sourceMappingURL=token.dto.js.map