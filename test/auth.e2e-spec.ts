import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { Phone } from '../src/api/user/entities/phone.entity';
import { User } from '../src/api/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../src/api/auth/auth.service';
import { AppModule } from '../src/app.module';
import { Jwt } from '../src/config/jwt';
import {
  ROUTE_BASE_PATH,
  ROUTE_VERSION,
} from '../src/constants/common.constants';
import { Auth } from '../src/api/auth/entities/auth.entity';
import { AccessTokenResponse } from '../src/api/auth/responses/access_token.response';
import { RefreshTokenResponse } from '../src/api/auth/responses/refresh_token.response';
import { UserService } from '../src/api/user/user.service';
import { createNewUser, getActivationToken } from './helpers/database.helper';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  let authService: AuthService;
  let jwt: Jwt;
  let configService: ConfigService;
  let authRepository: Repository<Auth>;
  let userRepository: Repository<User>;
  let phoneRepository: Repository<Phone>;
  const basePath = ROUTE_VERSION + '/' + ROUTE_BASE_PATH;
  const authBasePath = '/' + basePath + '/token';
  let accessTokenResponse: AccessTokenResponse;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix(basePath);
    await app.init();
    userRepository = moduleFixture.get('UserRepository');
    phoneRepository = moduleFixture.get('PhoneRepository');
    authRepository = moduleFixture.get('AuthRepository');

    userService = new UserService(userRepository, phoneRepository);
    authService = new AuthService(
      authRepository,
      userService,
      jwt,
      configService
    );
    const userPayload = {
      email: 'bandhan.roy1@gmail.com',
      phone: {
        area_code: '+91',
        number: '0123456789',
      },
      password: 'Password@1234',
      confirm_password: 'Password@1234',
    };
    const user = await createNewUser(
      userRepository,
      phoneRepository,
      userPayload
    );
    const token = await getActivationToken(user.uid);
    await request(app.getHttpServer())
      .post('/' + basePath + '/user/activate')
      .query({ token });
  });

  afterAll(async () => {
    await authRepository.query('DELETE FROM "auth"');
    await userRepository.query('DELETE FROM "user"');
    await phoneRepository.query('DELETE FROM "phone"');
    await app.close();
  });

  it('authService is defined', () => {
    expect(authService).toBeDefined();
  });

  it('/login (POST)', async () => {
    const authDto = { user: 'bandhan.roy1@gmail.com', pass: 'Password@1234' };
    const loginTokenDto = {
      refresh_token: 'refresh_token',
      grant_type: 'client_credential',
    };
    const response = await request(app.getHttpServer())
      .post(authBasePath + '/')
      .send(loginTokenDto)
      .auth(authDto.user, authDto.pass);

    expect(response.statusCode).toBe(200);
    accessTokenResponse = JSON.parse(JSON.stringify(response.body));
    expect(accessTokenResponse).toEqual(
      expect.objectContaining({
        access_token: expect.any(String),
        expires_in: expect.any(Number),
        refresh_token: expect.any(String),
        token_type: 'Bearer',
      })
    );
  });

  it('/refresh (POST)', async () => {
    const refreshTokenDto = {
      refresh_token: accessTokenResponse.refresh_token,
      grant_type: 'refresh_token',
    };
    const response = await request(app.getHttpServer())
      .post(authBasePath + '/')
      .send(refreshTokenDto)
      .set('authorization', 'Bearer ' + accessTokenResponse.access_token);

    expect(response.statusCode).toBe(200);
    const refreshTokenResponse: RefreshTokenResponse = JSON.parse(
      JSON.stringify(response.body)
    );
    accessTokenResponse.access_token = refreshTokenResponse.access_token;
    expect(refreshTokenResponse).toEqual(
      expect.objectContaining({
        access_token: expect.any(String),
        token_type: 'Bearer',
        expires_in: expect.any(Number),
      })
    );
  });

  it('(post) if refresh token not matches should return 403', async () => {
    const refreshTokenDto = {
      refresh_token: 'Invalid_refresh_token',
      grant_type: 'refresh_token',
    };
    const response = await request(app.getHttpServer())
      .post(authBasePath + '/')
      .send(refreshTokenDto)
      .set('authorization', 'Bearer ' + 'fake_refresh_token');

    expect(response.statusCode).toBe(403);
  });

  it('/verify (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(authBasePath + '/verify')
      .set('authorization', 'Bearer ' + accessTokenResponse.access_token);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(JSON.stringify(response.body))).toEqual(
      expect.objectContaining({
        result: null,
      })
    );
  });

  it('/logout (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete(authBasePath + '/')
      .set('authorization', 'Bearer ' + accessTokenResponse.access_token);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(JSON.stringify(response.body))).toEqual(
      expect.objectContaining({
        message: 'Deleted successfully.',
        result: null,
      })
    );
  });

  it('/verify (GET) if  token is deleted should throw 403 ', async () => {
    const response = await request(app.getHttpServer())
      .get(authBasePath + '/verify')
      .set('authorization', 'Bearer ' + accessTokenResponse.access_token);

    expect(response.statusCode).toBe(401);
  });

  it('(DELETE) if user logout failed should return 500', async () => {
    const response = await request(app.getHttpServer())
      .delete(authBasePath + '/')
      .set('authorization', 'Bearer ' + 'AccessToken');
    expect(response.statusCode).toBe(500);
  });
});
