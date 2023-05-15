import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Equal, IsNull, Repository } from 'typeorm';
import { UserRequestType } from '../../@types';
import { UserService } from '../../api/user/user.service';
import { Jwt } from '../../config/jwt';
import { cryptoUtil } from '../../utils/crypto.util';
import { currDate, updateDateTime } from '../../utils/date_time.util';
import { LoginDto } from './dto/login.dto';
import { Auth } from './entities/auth.entity';
import { AccessTokenResponse } from './responses/access_token.response';
import { RefreshTokenResponse } from './responses/refresh_token.response';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    private readonly userService: UserService,
    private readonly jwt: Jwt,
    private readonly configService: ConfigService
  ) {}

  async login(
    loginDto: LoginDto,
    host: string,
    url: string
  ): Promise<AccessTokenResponse> {
    // check if user name and password matches

    const userDetails = await this.userService.getUserDetails({
      where: {
        email: loginDto.username,
        deletedAt: null,
        isActive: true,
      },
    });

    if (!userDetails)
      throw new UnauthorizedException('Credentials do not match');
    // check if password matches
    const isMatched = await bcrypt.compare(
      loginDto.password,
      userDetails.password
    );
    if (!isMatched) throw new UnauthorizedException('Credentials do not match');
    const currDateTime = new Date();

    // generate token
    const { accessToken: access_token, expiresIn: access_token_expires_in } =
      this.jwt.encode(userDetails, host, url);
    // generate refresh token
    const refreshToken = cryptoUtil.encrypt(uuid());
    // refresh token expiry
    const refreshTokenExpiry = Number(
      updateDateTime(
        currDateTime,
        this.configService.get('JWT_REFRESH_TOKEN_EXPIRY'),
        7,
        'd'
      ).format('X')
    );
    // store the token in the database
    const auth = new Auth();

    auth.userId = userDetails.uid;
    auth.accessToken = access_token;
    auth.accessTokenExpiresIn = access_token_expires_in;
    auth.refreshToken = refreshToken;
    auth.refreshTokenExpiresIn = refreshTokenExpiry;
    auth.createdBy = userDetails.uid;
    await this.authRepository.save(auth);
    return {
      access_token: access_token,
      token_type: 'Bearer',
      expires_in: access_token_expires_in,
      refresh_token: refreshToken,
    };
  }

  async logout(accessToken: string, authUserDetails: UserRequestType) {
    // set deleted at and deleted by

    const update = await this.authRepository.update(
      {
        userId: authUserDetails.userId,
        accessToken: accessToken.split(' ')[1],
        deletedAt: IsNull(),
      },
      { deletedAt: new Date(), deletedBy: authUserDetails.userId }
    );
    if (!update.affected)
      throw new InternalServerErrorException('User logout failed');
    return null;
  }

  async refresh(
    refreshToken: string,
    accessToken: string,
    host: string,
    url: string
  ): Promise<RefreshTokenResponse> {
    const decodeData = this.jwt.decode(accessToken);

    if (!decodeData) throw new ForbiddenException('Access denied.');
    const userDetails = decodeData as UserRequestType;
    // check if refresh token matches
    const tokenDetails = await this.authRepository.findOne({
      where: {
        refreshToken,
        userId: Equal(userDetails.userId),
        deletedAt: null,
      },
    });

    if (!tokenDetails) throw new ForbiddenException('Access denied.');
    // check if refresh token is expired
    if (
      Number(currDate().getTime()) >
      tokenDetails.refreshTokenExpiresIn * 1000
    )
      throw new UnauthorizedException('Unauthorized.');
    // get the user details
    const user = await this.userService.getUserDetails({
      where: {
        email: userDetails.email,
        deletedAt: null,
      },
    });
    if (!user) throw new ForbiddenException('Access denied.');
    const { accessToken: access_token, expiresIn: access_token_expires_in } =
      this.jwt.encode(user, host, url);
    // save to the database
    const updated = await this.authRepository.update(
      { id: tokenDetails.id },
      {
        accessToken: access_token,
        accessTokenExpiresIn: access_token_expires_in,
        updatedAt: new Date(),
        updatedBy: user.uid,
      }
    );

    if (!updated.affected)
      throw new InternalServerErrorException(
        'Something went wrong!. Please try again later'
      );
    return {
      access_token: access_token,
      token_type: 'Bearer',
      expires_in: access_token_expires_in,
    };
  }

  async verify(token: string, user: UserRequestType): Promise<void> {
    // check if token is not deleted
    const tokenDetails = await this.authRepository.findOne({
      where: {
        accessToken: token,
        userId: Equal(user.userId),
        deletedAt: null,
      },
    });
    if (!tokenDetails) throw new UnauthorizedException();
  }
}
