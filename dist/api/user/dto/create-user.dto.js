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
exports.CreateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const match_decorator_1 = require("../../../decorators/match.decorator");
class Phone {
}
__decorate([
    (0, class_validator_1.MinLength)(2, {
        message: 'Area code is too short. Minimal length is $constraint1 characters, but actual is $value',
    }),
    (0, class_validator_1.MaxLength)(4, {
        message: 'Area code is too long. Maximum length is $constraint1 characters, but actual is $value',
    }),
    (0, swagger_1.ApiProperty)({
        description: 'Country code',
        required: true,
    }),
    __metadata("design:type", String)
], Phone.prototype, "area_code", void 0);
__decorate([
    (0, class_validator_1.MinLength)(4, {
        message: 'Phone number is too short. Minimal length is $constraint1 characters, but actual is $value',
    }),
    (0, class_validator_1.MaxLength)(13, {
        message: 'Phone number is too long. Maximum length is $constraint1 characters, but actual is $value',
    }),
    (0, swagger_1.ApiProperty)({
        description: 'Phone number',
        required: true,
    }),
    __metadata("design:type", String)
], Phone.prototype, "number", void 0);
class CreateUserDto {
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, swagger_1.ApiProperty)({
        description: 'Email ID of the user',
        required: true,
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Phone),
    (0, class_validator_1.ValidateNested)(),
    (0, swagger_1.ApiProperty)({
        description: 'Phone number of the user',
        required: true,
        type: () => Phone,
    }),
    __metadata("design:type", Phone)
], CreateUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User password',
        required: true,
    }),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.Matches)(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password too weak',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User confirm password',
        required: true,
    }),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(20),
    (0, match_decorator_1.Match)('password', { message: 'Password did not match' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "confirm_password", void 0);
exports.CreateUserDto = CreateUserDto;
//# sourceMappingURL=create-user.dto.js.map