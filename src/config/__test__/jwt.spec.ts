import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Jwt } from '../jwt';

describe('JWT', () => {
  let configService: ConfigService;
  let jwtService: JwtService;
  let jwt: Jwt;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Jwt, JwtService, ConfigService],
    }).compile();
    configService = module.get<ConfigService>(ConfigService);
    jwtService = module.get<JwtService>(JwtService);
    jwt = module.get<Jwt>(Jwt);
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('jwt should be defined ', () => {
    expect(jwt).toBeDefined();
  });
  describe('jwt.encode ', () => {
    const host = 'localhost';
    const url = '/v1/api/token';
    it('should return accessToken and expiresIn as object', async () => {
      const jwtServiceMock = jest
        .spyOn(jwtService, 'sign')
        .mockReturnValueOnce('Access_Token');
      const jwtMock = jwt.encode(
        {
          uid: expect.any(String),
          email: 'Tester@gmail.com',
        },
        host,
        url
      );
      expect(jwtMock).toMatchObject({
        accessToken: expect.any(String),
        expiresIn: expect.any(Number),
      });
    });
  });
  describe('jwt.verify ', () => {
    it('should return UserRequestType ', async () => {
      const jwtServiceMock = jest
        .spyOn(jwtService, 'verify')
        .mockReturnValueOnce({
          email: expect.any(String),
          userId: expect.any(String),
          exp: expect.any(Number),
          aud: expect.any(String),
          iss: expect.any(String),
          sub: expect.any(String),
        });
      const jwtMock = jwt.verify('Access_Token');
      expect(jwtServiceMock).toBeCalled();
      expect(jwtMock).toMatchObject({
        email: expect.any(String),
        userId: expect.any(String),
        exp: expect.any(Number),
        aud: expect.any(String),
        iss: expect.any(String),
        sub: expect.any(String),
      });
    });
  });

  describe('jwt.decode', () => {
    it('should return decoded value', async () => {
      const jwtServiceMock = jest
        .spyOn(jwtService, 'decode')
        .mockReturnValueOnce({
          email: expect.any(String),
          userId: expect.any(String),
          exp: expect.any(Number),
          aud: expect.any(String),
          iss: expect.any(String),
          sub: expect.any(String),
        });
      const jwtMock = jwt.decode('Access_Token');
      expect(jwtServiceMock).toBeCalled();
      expect(jwtMock).toMatchObject({
        email: expect.any(String),
        userId: expect.any(String),
        exp: expect.any(Number),
        aud: expect.any(String),
        iss: expect.any(String),
        sub: expect.any(String),
      });
    });
  });
});
