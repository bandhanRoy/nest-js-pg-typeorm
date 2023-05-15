import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { UserRequestType } from '../../@types';
import { UserService } from '../../api/user/user.service';
import { Jwt } from '../../config/jwt';
import { LoginDto } from './dto/login.dto';
import { Auth } from './entities/auth.entity';
import { AccessTokenResponse } from './responses/access_token.response';
import { RefreshTokenResponse } from './responses/refresh_token.response';
export declare class AuthService {
    private readonly authRepository;
    private readonly userService;
    private readonly jwt;
    private readonly configService;
    constructor(authRepository: Repository<Auth>, userService: UserService, jwt: Jwt, configService: ConfigService);
    login(loginDto: LoginDto, host: string, url: string): Promise<AccessTokenResponse>;
    logout(accessToken: string, authUserDetails: UserRequestType): Promise<any>;
    refresh(refreshToken: string, accessToken: string, host: string, url: string): Promise<RefreshTokenResponse>;
    verify(token: string, user: UserRequestType): Promise<void>;
}
