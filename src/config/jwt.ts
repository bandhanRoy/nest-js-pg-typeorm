import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs';
import { UserRequestType } from '../@types';
import { User } from '../api/user/entities/user.entity';
import { updateDateTime } from '../utils/date_time.util';

@Injectable()
export class Jwt {
  private storeSSLKeyData: Record<string, string> = {};

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  encode(
    payload: Pick<User, 'email' | 'uid'>,
    host: string,
    url: string
  ): { accessToken: string; expiresIn: number } {
    // access token expiry
    const expiresIn = Number(
      updateDateTime(
        new Date(),
        this.configService.get('JWT_EXPIRES_IN'),
        2,
        'h'
      ).format('X')
    );
    const accessToken = this.jwtService.sign(
      {
        email: payload.email,
        userId: payload.uid,
      },
      {
        secret: this.getKeyData(this.configService.get<string>('PVT_KEY')),
        algorithm: 'RS256',
        issuer: host + url,
        audience: host, // host
        subject: payload.uid,
        mutatePayload:
          String(this.configService.get('JWT_MUTATE_PAYLOAD')) === 'true'
            ? true
            : false,
        noTimestamp:
          String(this.configService.get('JWT_NO_TIMESTAMP')) === 'true'
            ? true
            : false,
        expiresIn: this.configService.get('JWT_EXPIRES_IN') ?? 7200, // In seconds (2h = 7200secs)
      }
    );

    return { accessToken, expiresIn };
  }

  verify(token: string): UserRequestType {
    return this.jwtService.verify<UserRequestType>(token, {
      secret: this.getKeyData(this.configService.get<string>('PUB_KEY')),
    });
  }

  decode(token: string) {
    return this.jwtService.decode(token);
  }

  private getKeyData(keyPath: string): string {
    const storedData = this.storeSSLKeyData[keyPath];
    if (!storedData) {
      const data = fs.readFileSync(keyPath, 'utf8');
      this.storeSSLKeyData[keyPath] = data;
      return data;
    }
    return storedData;
  }
}
