import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  ROUTE_BASE_PATH,
  ROUTE_VERSION,
} from '../src/constants/common.constants';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const basePath = ROUTE_VERSION + '/' + ROUTE_BASE_PATH;
  // const appBasePath = '/' + basePath;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix(basePath);
    await app.init();
  });

  it('/ (GET)', () => {
    expect(true).toBe(true);
  });
});
