import {
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as shortUUID from 'short-uuid';
import { Equal, IsNull, Repository } from 'typeorm';
import { Jwt } from '../../config/jwt';
import { cryptoUtil } from '../../utils/crypto.util';
import { Phone } from '../user/entities/phone.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';

describe('AuthService', () => {
  const userPayload = {
    email: 'Tester@gmail.com',
    phone: {
      area_code: '+91',
      number: '0123456789',
    },
    password: 'Password@1234',
    confirm_password: 'Password@1234',
  };
  const loginPayload = {
    username: 'Tester@gmail.com',
    password: 'Password@1234',
  };
  const host = 'localhost';
  const url = '/v1/api/token';
  const userUID = shortUUID.generate();
  let service: AuthService;
  let userService: UserService;
  let authRepository: Repository<Auth>;
  let phoneRepository: Repository<Phone>;
  let userRepository: Repository<User>;
  let jwt: Jwt;
  let configService: ConfigService;
  let jwtService: JwtService;

  const PHONE_REPOSITORY_TOKEN = getRepositoryToken(Phone);
  const AUTH_REPOSITORY_TOKEN = getRepositoryToken(Auth);
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        Jwt,
        ConfigService,
        UserService,
        JwtService,
        {
          provide: AUTH_REPOSITORY_TOKEN,
          useValue: {
            login: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: PHONE_REPOSITORY_TOKEN,
          useValue: {},
        },
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authRepository = module.get<Repository<Auth>>(AUTH_REPOSITORY_TOKEN);
    phoneRepository = module.get<Repository<Phone>>(PHONE_REPOSITORY_TOKEN);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
    jwt = module.get<Jwt>(Jwt);
    configService = module.get<ConfigService>(ConfigService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('authService should be defined', () => {
    expect(service).toBeDefined();
  });

  it('authRepository should be defined', () => {
    expect(authRepository).toBeDefined();
  });
  describe('authService.login', () => {
    it('should comapre password', async () => {
      const userRepoMock = jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValueOnce(
          Promise.resolve({
            id: 1,
            uid: userUID,
            email: 'Tester@gmail.com',
            password: 'hashedPassword',
            createdAt: new Date(),
            createdBy: userUID,
            isActive: true,
            phone: new Phone(),
          })
        );
      const bcryptMock = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(
          async (_loginPassword, _userPassword) => await Promise.resolve(true)
        );
      await service.login(loginPayload, host, url);
      expect(bcryptMock).toBeCalled();
      expect(bcryptMock).toBeCalledTimes(1);
      expect(bcryptMock).toBeCalledWith(
        loginPayload.password,
        'hashedPassword'
      );
    });
    it('should call login when grantype is client_credential ', async () => {
      const userRepoMock = jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValueOnce(
          Promise.resolve({
            id: 1,
            uid: userUID,
            email: 'Tester@gmail.com',
            password: 'hashedPassword',
            createdAt: new Date(),
            createdBy: userUID,
            isActive: true,
            phone: new Phone(),
          })
        );
      const bcryptMock = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(
          async (_loginPassword, _userPassword) => await Promise.resolve(true)
        );
      const jwtMock = jest.spyOn(jwt, 'encode').mockReturnValueOnce({
        accessToken: 'Access Token',
        expiresIn: 1674783404,
      });
      const cryptoMock = jest
        .spyOn(cryptoUtil, 'encrypt')
        .mockReturnValueOnce('Refresh Token');
      const authMock = jest.spyOn(authRepository, 'save').mockReturnValueOnce(
        Promise.resolve({
          id: 1,
          userId: userUID,
          accessToken: 'Access Token',
          accessTokenExpiresIn: 1674783404,
          refreshToken: 'Refresh Token',
          refreshTokenExpiresIn: 1675384604,
          createdAt: new Date(),
          createdBy: userUID,
          deletedAt: null,
          updatedAt: new Date(),
        })
      );
      const loginMock = jest.spyOn(service, 'login');
      const authLoginMock = await service.login(loginPayload, host, url);
      expect(userRepoMock).toBeCalled();
      expect(bcryptMock).toBeCalled();
      expect(jwtMock).toBeCalled();
      expect(cryptoMock).toBeCalled();
      expect(authMock).toBeCalled();
      expect(loginMock).toBeCalled();
      expect(loginMock).toBeCalledTimes(1);
      expect(authLoginMock).toStrictEqual({
        access_token: 'Access Token',
        token_type: 'Bearer',
        expires_in: 1674783404,
        refresh_token: 'Refresh Token',
      });
    });
    it('should throw unauthorized exception for failed fetch user', async () => {
      try {
        const userRepoMock = jest
          .spyOn(userRepository, 'findOne')
          .mockReturnValueOnce(Promise.resolve(null));
        await service.login(loginPayload, host, url);
        expect(userRepoMock).toBeCalled();
        expect(userRepoMock).toBeCalledWith({
          where: {
            email: loginPayload.username,
            deletedAt: null,
            isActive: true,
          },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
    it('should throw unauthorized exception for wrong password', async () => {
      try {
        const userRepoMock = jest
          .spyOn(userRepository, 'findOne')
          .mockReturnValueOnce(
            Promise.resolve({
              id: 1,
              uid: userUID,
              email: 'Tester@gmail.com',
              password: 'hashedPassword',
              createdAt: new Date(),
              createdBy: userUID,
              isActive: true,
              phone: new Phone(),
            })
          );
        const bcryptMock = jest
          .spyOn(bcrypt, 'compare')
          .mockImplementation(
            async (_loginPassword, _userPassword) =>
              await Promise.resolve(false)
          );
        await service.login(loginPayload, host, url);
        expect(userRepoMock).toBeCalled();
        expect(bcryptMock).toBeCalledWith(
          loginPayload.password,
          'Hashed Password'
        );
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
  describe('authService.refresh', () => {
    it('should call refresh login when grantype is refresh_token ', async () => {
      const jwtMock1 = jest.spyOn(jwt, 'decode').mockReturnValueOnce(() => {
        return {
          email: 'Tester@gmail.com',
          userId: userUID,
          exp: 1674790067,
          aud: 'localhost',
          iss: 'localhost/v1/api/token',
          sub: '1JrvuEj3KpbXxh4LDzaVfZ',
        };
      });

      const authRepoMock = jest
        .spyOn(authRepository, 'findOne')
        .mockReturnValueOnce(
          Promise.resolve({
            id: 1,
            userId: userUID,
            accessToken: 'Access Token',
            accessTokenExpiresIn: 1674783404,
            refreshToken: 'Refresh Token',
            refreshTokenExpiresIn: 1675384604,
            createdAt: new Date(),
            createdBy: userUID,
            deletedAt: null,
            updatedAt: new Date(),
          })
        );
      const userRepoMock = jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValueOnce(
          Promise.resolve({
            id: 1,
            uid: userUID,
            email: 'Tester@gmail.com',
            password: 'hashedPassword',
            createdAt: new Date(),
            createdBy: userUID,
            isActive: true,
            phone: new Phone(),
          })
        );
      const jwtMock2 = jest.spyOn(jwt, 'encode').mockReturnValueOnce({
        accessToken: 'Access Token',
        expiresIn: 1674783404,
      });

      const updateMock = jest
        .spyOn(authRepository, 'update')
        .mockReturnValue(
          Promise.resolve({ generatedMaps: [], raw: [], affected: 1 })
        );
      const refreshMock = jest.spyOn(service, 'refresh');
      const AccessToken = 'Access_Token';
      const RefreshToken = 'Refresh_Token';
      const authRefreshMock = await service.refresh(
        RefreshToken,
        AccessToken,
        host,
        url
      );
      expect(authRepoMock).toBeCalled();
      expect(userRepoMock).toBeCalled();
      expect(updateMock).toBeCalled();
      expect(jwtMock1).toBeCalled();
      expect(jwtMock2).toBeCalled();
      expect(refreshMock).toBeCalledTimes(1);
      expect(authRefreshMock).toStrictEqual({
        access_token: 'Access Token',
        token_type: 'Bearer',
        expires_in: 1674783404,
      });
    });
    it('should throw forbidden exception for failed decode accessToken', async () => {
      try {
        const jwtMock1 = jest.spyOn(jwt, 'decode').mockReturnValueOnce(() => {
          return null;
        });

        const AccessToken = 'Access_Token';
        const RefreshToken = 'Refresh_Token';
        await service.refresh(RefreshToken, AccessToken, host, url);
        expect(jwtMock1).toBeCalled();
        expect(jwtMock1).toBeCalledWith(AccessToken);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
    it('should throw forbidden exception for failed to match refreshToken', async () => {
      try {
        const jwtMock1 = jest.spyOn(jwt, 'decode').mockReturnValueOnce(() => {
          return {
            email: 'Tester@gmail.com',
            userId: userUID,
            exp: 1674790067,
            aud: 'localhost',
            iss: 'localhost/v1/api/token',
            sub: '1JrvuEj3KpbXxh4LDzaVfZ',
          };
        });
        const authRepoMock = jest
          .spyOn(authRepository, 'findOne')
          .mockReturnValueOnce(Promise.resolve(null));
        const AccessToken = 'Access_Token';
        const RefreshToken = 'Refresh_Token';
        await service.refresh(RefreshToken, AccessToken, host, url);
        expect(authRepoMock).toBeCalled();
        expect(authRepoMock).toBeCalledWith({
          where: {
            RefreshToken,
            userId: Equal(userUID),
            deletedAt: null,
          },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
    it('should throw unauthorized exception if refresh token expired', async () => {
      try {
        const jwtMock1 = jest.spyOn(jwt, 'decode').mockReturnValueOnce(() => {
          return {
            email: 'Tester@gmail.com',
            userId: userUID,
            exp: 1674790067,
            aud: 'localhost',
            iss: 'localhost/v1/api/token',
            sub: '1JrvuEj3KpbXxh4LDzaVfZ',
          };
        });
        const authRepoMock = jest
          .spyOn(authRepository, 'findOne')
          .mockReturnValueOnce(
            Promise.resolve({
              id: 1,
              userId: userUID,
              accessToken: 'Access Token',
              accessTokenExpiresIn: 1674783404,
              refreshToken: 'Refresh Token',
              refreshTokenExpiresIn: 167538460,
              createdAt: new Date(),
              createdBy: userUID,
              deletedAt: null,
              updatedAt: new Date(),
            })
          );

        const userRepoMock = jest
          .spyOn(userRepository, 'findOne')
          .mockReturnValueOnce(
            Promise.resolve({
              id: 1,
              uid: userUID,
              email: 'Tester@gmail.com',
              password: 'hashedPassword',
              createdAt: new Date(),
              createdBy: userUID,
              isActive: true,
              phone: new Phone(),
            })
          );

        const AccessToken = 'Access_Token';
        const RefreshToken = 'Refresh_Token';

        await service.refresh(RefreshToken, AccessToken, host, url);
        expect(userRepoMock).toBeCalled();

        expect(userRepoMock).toBeCalledWith({
          where: {
            email: userPayload.email,
            deletedAt: null,
          },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
    it('should throw forbidden exception if failed to fetch user', async () => {
      try {
        const jwtMock1 = jest.spyOn(jwt, 'decode').mockReturnValueOnce(() => {
          return {
            email: 'Tester@gmail.com',
            userId: userUID,
            exp: 1674790067,
            aud: 'localhost',
            iss: 'localhost/v1/api/token',
            sub: '1JrvuEj3KpbXxh4LDzaVfZ',
          };
        });
        const authRepoMock = jest
          .spyOn(authRepository, 'findOne')
          .mockReturnValueOnce(
            Promise.resolve({
              id: 1,
              userId: userUID,
              accessToken: 'Access Token',
              accessTokenExpiresIn: 1674783404,
              refreshToken: 'Refresh Token',
              refreshTokenExpiresIn: 1674905715567,
              createdAt: new Date(),
              createdBy: userUID,
              deletedAt: null,
              updatedAt: new Date(),
            })
          );

        const userRepoMock = jest
          .spyOn(userRepository, 'findOne')
          .mockReturnValueOnce(Promise.resolve(null));

        const AccessToken = 'Access_Token';
        const RefreshToken = 'Refresh_Token';
        await service.refresh(RefreshToken, AccessToken, host, url);
        expect(userRepoMock).toBeCalled();
        expect(userRepoMock).toBeCalledWith({
          where: {
            email: userPayload.email,
            deletedAt: null,
          },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  });
  describe('authService.logout', () => {
    it('should logout', async () => {
      const updateMock1 = jest
        .spyOn(authRepository, 'update')
        .mockReturnValue(
          Promise.resolve({ generatedMaps: [], raw: [], affected: 1 })
        );
      const logoutMock = jest.spyOn(service, 'logout');
      const AccessToken = 'Access_Token';
      const userRepoMock = {
        email: 'Tester@gmail.com',
        userId: userUID,
        exp: 1674814683,
        aud: host,
        iss: url,
        sub: userUID,
      };
      await service.logout(AccessToken, userRepoMock);
      expect(updateMock1).toBeCalled();
      expect(logoutMock).toBeCalled();
    });
    it('should throw internal server  exception ', async () => {
      try {
        const updateMock1 = jest
          .spyOn(authRepository, 'update')
          .mockReturnValue(
            Promise.resolve({ generatedMaps: [], raw: [], affected: 0 })
          );
        const AccessToken = 'Access_Token';
        const userRepoMock = {
          email: 'Tester@gmail.com',
          userId: userUID,
          exp: 1674814683,
          aud: host,
          iss: url,
          sub: userUID,
        };
        await service.logout(AccessToken, userRepoMock);
        expect(updateMock1).toBeCalled();
        expect(updateMock1).toBeCalledWith(
          {
            userId: userUID,
            accessToken: AccessToken,
            deletedAt: IsNull(),
          },
          { deletedAt: new Date(), deletedBy: userUID }
        );
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
  describe('authService.verify', () => {
    it('should verify Token', async () => {
      const authRepoMock = jest
        .spyOn(authRepository, 'findOne')
        .mockReturnValueOnce(
          Promise.resolve({
            id: 1,
            userId: userUID,
            accessToken: 'Access Token',
            accessTokenExpiresIn: 1674783404,
            refreshToken: 'Refresh Token',
            refreshTokenExpiresIn: 1675384604,
            createdAt: new Date(),
            createdBy: userUID,
            deletedAt: null,
            updatedAt: new Date(),
          })
        );
      const verifyMock = jest.spyOn(service, 'verify');
      const AccessToken = 'Access_Token';
      const userMock = {
        email: 'Tester@gmail.com',
        userId: userUID,
        exp: 1674814683,
        aud: host,
        iss: url,
        sub: userUID,
      };
      await service.verify(AccessToken, userMock);
      expect(authRepoMock).toBeCalled();
      expect(verifyMock).toBeCalled();
      expect(verifyMock).toBeCalledTimes(1);
    });
    it('should throw unauthorized exception ', async () => {
      try {
        const authRepoMock = jest
          .spyOn(authRepository, 'findOne')
          .mockReturnValueOnce(Promise.resolve(null));
        const AccessToken = 'Access_Token';
        const userMock = {
          email: 'Tester@gmail.com',
          userId: userUID,
          exp: 1674814683,
          aud: host,
          iss: url,
          sub: userUID,
        };
        await service.verify(AccessToken, userMock);
        expect(authRepoMock).toBeCalled();
        expect(authRepoMock).toBeCalledWith({
          where: {
            accessToken: AccessToken,
            userId: Equal(userUID),
            deletedAt: null,
          },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
