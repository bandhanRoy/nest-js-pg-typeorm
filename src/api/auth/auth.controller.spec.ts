import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as shortUUID from 'short-uuid';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Jwt } from '../../config/jwt';
import { Phone } from '../user/entities/phone.entity';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const userUID = shortUUID.generate();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        Jwt,
        ConfigService,
        UserService,
        JwtService,
        {
          provide: getRepositoryToken(Auth),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Phone),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const host = 'localhost';
  const url = '/v1/api/token';

  //Testing get access token
  describe('controller.getaccesstoken', () => {
    it('should call login when grant_type is client_credential', async () => {
      const mockGranttType = 'client_credential';
      const mockTokenDto = {
        refresh_token: 'refresh_token',
        grant_type: mockGranttType,
      };
      const accessToken = 'Access_Token';
      const mockLoginResponse = {
        access_token: 'access_token',
        token_type: 'Bearer',
        expires_in: 121,
        refresh_token: 'refresh_token',
      };
      const mockLoginDto = {
        username: 'name of the user',
        password: 'hashedpassword',
      };
      const loginMock = jest
        .spyOn(controller, 'getAccessToken')
        .mockReturnValueOnce(
          Promise.resolve({
            access_token: 'access_token',
            token_type: 'Bearer',
            expires_in: 121,
            refresh_token: 'refresh_token',
          })
        );

      await controller.getAccessToken(mockTokenDto, accessToken, host, url);
      expect(loginMock).toHaveBeenCalled();
      expect(loginMock).toHaveBeenCalledTimes(1);
      expect(mockTokenDto.grant_type).toBe('client_credential');
      expect(loginMock).toBeCalledWith(mockTokenDto, accessToken, host, url);
    });

    it('should  call refresh when grant_type is refresh_token', async () => {
      const mockGranttType = 'refresh_token';

      const mockTokenDto = {
        refresh_token: 'refresh_tokenÍ',
        grant_type: 'refresh_token',
      };
      const accessToken = 'Access_Token';
      const mockRefreshResponse = {
        access_token: 'access_token',
        token_type: 'Bearer',
        expires_in: 111,
      };
      const mockRefreshDto = {
        refresh_token: 'refresh_token',
        grant_type: 'grant_type',
      };
      const refreshMock = jest
        .spyOn(controller, 'getAccessToken')
        .mockReturnValueOnce(
          Promise.resolve({
            access_token: 'access_token',
            token_type: 'Bearer',
            expires_in: 111,
          })
        );
      await controller.getAccessToken(mockTokenDto, accessToken, host, url);
      expect(refreshMock).toHaveBeenCalled();
      expect(refreshMock).toHaveBeenCalledTimes(1);
      expect(refreshMock).toBeCalledWith(mockTokenDto, accessToken, host, url);
      expect(mockTokenDto.grant_type).toBe('refresh_token');
    });
  });

  //Testing logout
  describe('controller.logout', () => {
    it('should logout user', async () => {
      const mockUserRequestType = {
        email: 'tester@gmail.com',
        userId: userUID,
        exp: 12321,
        aud: 'localhost',
        iss: 'localhost/v1/api/token',
        sub: '1JrvuEj3KpbXxh4LDzaVfZ',
      };
      const mockLogoutResopnse = null;
      const logoutSpy = jest
        .spyOn(service, 'logout')
        .mockImplementation(mockLogoutResopnse);
      expect(
        await controller.logout('accessToken', mockUserRequestType)
      ).toStrictEqual({
        message: 'Deleted successfully.',
        result: undefined,
      });
      expect(logoutSpy).toHaveBeenCalled();
      expect(logoutSpy).toHaveBeenCalledTimes(1);
    });
  });

  //Testing verify
  describe('controller.verify', () => {
    it('should verify user', async () => {
      const mockUserRequestType = {
        email: 'Tester@gmail.com',
        userId: 'userUID',
        exp: 1674790067,
        aud: 'localhost',
        iss: 'localhost/v1/api/token',
        sub: '1JrvuEj3KpbXxh4LDzaVfZ',
      };
      const mockVerifyResponse = null;
      const verifySpy = jest
        .spyOn(service, 'verify')
        .mockImplementation(mockVerifyResponse);
      expect(
        await controller.verify('accessToken', mockUserRequestType)
      ).toStrictEqual({ result: null });
      expect(verifySpy).toHaveBeenCalled();
      expect(verifySpy).toHaveBeenCalledTimes(1);
    });
  });
});
