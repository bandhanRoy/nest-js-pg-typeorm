import { UserRequestType } from '../../@types';
import { IGenericResponse } from '../../interfaces/controller_response.interface';
import { AuthService } from './auth.service';
import { AccessTokenResponse } from './responses/access_token.response';
import { RefreshTokenResponse } from './responses/refresh_token.response';
import { TokenDTO } from './dto/token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getAccessToken(generateTokenPayload: TokenDTO, accessToken: string, host: string, url: string): Promise<AccessTokenResponse | RefreshTokenResponse>;
    private login;
    private refresh;
    logout(accessToken: string, user: UserRequestType): Promise<{
        message: string;
        result: any;
    }>;
    verify(accessToken: string, user: UserRequestType): Promise<IGenericResponse<null>>;
}
