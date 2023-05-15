import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { Phone } from '../src/api/user/entities/phone.entity';
import { User } from '../src/api/user/entities/user.entity';
import { UserService } from '../src/api/user/user.service';
import { AppModule } from '../src/app.module';
import {
  ROUTE_BASE_PATH,
  ROUTE_VERSION,
} from '../src/constants/common.constants';

import { createNewUser, getActivationToken } from './helpers/database.helper';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  let userRepository: Repository<User>;
  let phoneRepository: Repository<Phone>;
  const basePath = ROUTE_VERSION + '/' + ROUTE_BASE_PATH;
  const userBasePath = '/' + basePath + '/user';
  const userPayload = {
    email: 'bandhan.roy1@gmail.com',
    phone: {
      area_code: '+91',
      number: '0123456789',
    },
    password: 'Password@1234',
    confirm_password: 'Password@1234',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix(basePath);
    await app.init();
    userRepository = moduleFixture.get('UserRepository');
    phoneRepository = moduleFixture.get('PhoneRepository');
    userService = new UserService(userRepository, phoneRepository);
  });

  afterAll(async () => {
    await userRepository.query('DELETE FROM "user"');
    await phoneRepository.query('DELETE FROM "phone"');
    await app.close();
  });

  it('userService is defined', () => {
    expect(userService).toBeDefined();
  });

  it('/register (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post(userBasePath + '/register')
      .send(userPayload);
    expect(response.statusCode).toBe(201);
    expect(JSON.parse(JSON.stringify(response.body))).toEqual(
      expect.objectContaining({
        statusCode: 201,
        message: expect.any(String),
        result: null,
      })
    );
  });
  it('(post) if user already exist should return 409 ', async () => {
    const response = await request(app.getHttpServer())
      .post(userBasePath + '/register')
      .send(userPayload);
    expect(response.statusCode).toBe(409);
  });

  it('/activate (POST)', async () => {
    const user = await createNewUser(
      userRepository,
      phoneRepository,
      userPayload
    );
    const token = await getActivationToken(user.uid);
    const response = await request(app.getHttpServer())
      .post(userBasePath + '/activate')
      .query({ token: token });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(JSON.stringify(response.body))).toEqual(
      expect.objectContaining({
        statusCode: 201,
        message: 'User activated successfully',
        result: null,
      })
    );
  });
  it('(Post)/activate if invalid token then should return 401 ', async () => {
    const invalidToken =
      '4f42ea3f88847370c20f9b154218a22c:0b40f02e374f0561b4df9aeaa2b1c3d48fbd0c68aa9ec457cff6b2dc477b44835cdfbc695eb80c9fdec10a436848de4ed096aec6a789b65a0cf4b4c37250eaf3daa9dc75aae573ac88245419982edce8a2d7fbae60f5913046c7c555ddc8bfc2';
    const response = await request(app.getHttpServer())
      .post(userBasePath + '/activate')
      .query({ token: invalidToken });
    expect(response.statusCode).toBe(401);
  });
});
