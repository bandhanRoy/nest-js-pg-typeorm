import { AccessTokenResponse } from './access_token.response';
declare const RefreshTokenResponse_base: import("@nestjs/common").Type<Pick<AccessTokenResponse, "access_token" | "token_type" | "expires_in">>;
export declare class RefreshTokenResponse extends RefreshTokenResponse_base {
}
export {};
