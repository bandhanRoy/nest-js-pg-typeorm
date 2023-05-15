import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRequestType } from '../@types';
import { User } from '../api/user/entities/user.entity';
export declare class Jwt {
    private readonly configService;
    private readonly jwtService;
    private storeSSLKeyData;
    constructor(configService: ConfigService, jwtService: JwtService);
    encode(payload: Pick<User, 'email' | 'uid'>, host: string, url: string): {
        accessToken: string;
        expiresIn: number;
    };
    verify(token: string): UserRequestType;
    decode(token: string): string | {
        [key: string]: any;
    };
    private getKeyData;
}
