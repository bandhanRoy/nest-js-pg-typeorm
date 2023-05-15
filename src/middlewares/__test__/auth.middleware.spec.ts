import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { NextFunction, Request, Response } from 'express';
import { Jwt } from '../../config/jwt';

import { AuthMiddleware } from '../auth.middleware';

describe('Middleware', () => {
  let jwt: Jwt;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Jwt, ConfigService, JwtService],
    }).compile();
    jwt = module.get<Jwt>(Jwt);
    mockRequest = {};
    mockResponse = {};
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('JWT shoul defined ', () => {
    expect(jwt).toBeDefined();
  });

  it('shoul call middleware with headers ', async () => {
    mockRequest = {
      headers: {
        authorization:
          'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNyaWppdGhAZ21haWwuY29tIiwidXNlcklkIjoiNHVkejVyb1E2YzRZcGZKV01pWDJGWCIsImV4cCI6MTY3NjI3MDc2NSwiYXVkIjoibG9jYWxob3N0IiwiaXNzIjoibG9jYWxob3N0L3YxL2FwaS90b2tlbj9kZWJ1Zz10cnVlIiwic3ViIjoiNHVkejVyb1E2YzRZcGZKV01pWDJGWCJ9.oKCK-jsvzHxjM5PNSx3497TFI68XfmvQ-FcJr9NjM8UQT0VvWc_vQ-cqfDH9RvJ39VvB3GxRZagEFRIeWDtSNUDFdnrt5LlFrXAriYSiIBHlAPpF1--a7JovON7Hfy1J3UNP_kD27jXsEP5WV3v6yIw00nUWQhanF9mLBQWjULmbHnGe1G7oYCuNMuJGkYsdJwuYOtHhd18E8p745Tu6Vy2v8Pzyh6hm-pfBnLL191bydP9UXC9ivv6lH6Q4Ko61o6XDUwBu1olgznMKMWcifHOVxvGafzmwtWjILCjJbTrF17Rg0z884tvdetJC4YrSVLrGlRKoFJIoIy20kaVORA',
      },
    };
    const auth = new AuthMiddleware(jwt);
    auth.use(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toBeCalledTimes(1);
  });
});
