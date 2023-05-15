"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const access_token_response_1 = require("./access_token.response");
class RefreshTokenResponse extends (0, swagger_1.PickType)(access_token_response_1.AccessTokenResponse, [
    'access_token',
    'expires_in',
    'token_type',
]) {
}
exports.RefreshTokenResponse = RefreshTokenResponse;
//# sourceMappingURL=refresh_token.response.js.map