import { Injectable } from '@nestjs/common';
import { Options, responseInterceptor } from 'http-proxy-middleware';
import {
  API_SERVICE_URL,
  ROUTE_BASE_PATH,
  ROUTE_VERSION,
} from '../../constants/common.constants';
import { logger } from '../../config/logger';
import { Request, Response } from 'express';
import { Url } from 'url';
import { ClientRequest, IncomingMessage } from 'http';
import { cleanUpResponse } from '../../utils/lms.util';
import { Filter, OnProxyReqCallback } from 'http-proxy-middleware/dist/types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LmsProxyService implements Options {
  private token = '';
  private cookies: string[] = [];

  public target = API_SERVICE_URL;
  public changeOrigin = true;
  public pathRewrite = {
    [`^/${ROUTE_VERSION}/${ROUTE_BASE_PATH}/lms/file/private`]:
      '/Files/Private',
    [`^/${ROUTE_VERSION}/${ROUTE_BASE_PATH}/lms/file/public`]: '/Files/Public',
    [`^/${ROUTE_VERSION}/${ROUTE_BASE_PATH}/lms`]: '/api/rest/v2',
  };
  public logLevel: 'debug' | 'info' | 'warn' | 'error' | 'silent' = 'debug';
  public selfHandleResponse = true;
  public onProxyRes = responseInterceptor(
    (
      responseBuffer: Buffer,
      proxyRes: IncomingMessage,
      req: Request,
      res: Response
    ) => this.modifyResponse(responseBuffer, proxyRes, req, res)
  );
  public onProxyReq: OnProxyReqCallback = (
    proxyReq: ClientRequest,
    req: Request,
    res: Response
  ) => this.modifyRequest(proxyReq, req, res);

  constructor(private readonly configService: ConfigService) {}

  public logProvider() {
    logger['info'] = logger['log']; // library needs info log
    return logger;
  }
  public filter: Filter = function (pathname: string, _req: Request) {
    return !!pathname.match(`^/${ROUTE_VERSION}/${ROUTE_BASE_PATH}/lms`);
  };

  public onError(
    err: Error,
    _req: Request,
    res: Response,
    _target: string | Partial<Url>
  ) {
    // * write a proper error throwing error will also work
    logger.error(err);
    res.writeHead(500, {
      'Content-Type': 'application/json',
    });
    // TODO: write proper error message
    res.end(
      JSON.stringify({
        message:
          'Something went wrong. And we are reporting a custom error message.',
      })
    );
  }

  private modifyRequest(
    this: LmsProxyService,
    proxyReq: ClientRequest,
    _req: Request,
    _res: Response
  ) {
    // * set the token and the api key over here
    proxyReq.setHeader('Cookie', this.cookies.join(' '));
    proxyReq.setHeader(
      'X-Absorb-API-Key',
      this.configService.get<string>('ABSORB_API_KEY')
    );
    logger.log(`Hitting request url: ${API_SERVICE_URL}${proxyReq.path}`);
    this.token && proxyReq.setHeader('Authorization', 'Bearer ' + this.token);
    // console.log(proxyReq.getHeaders());
    // ? if needed log the request
    // if (req.headers['content-type'] === 'application/json')
    //   proxyReq.setHeader('content-type', 'application/hal+json');
  }

  private async modifyResponse(
    this: LmsProxyService,
    responseBuffer: Buffer,
    proxyRes: IncomingMessage,
    req: Request,
    _res: Response
  ) {
    // * if needed log the response
    // log original request and proxied request info
    const exchange = `[DEBUG] ${req.method} ${req.path} -> ${proxyRes?.['req'].protocol}//${proxyRes?.['req'].host}${proxyRes?.['req'].path} [${proxyRes.statusCode}]`;
    logger.debug(exchange); // [DEBUG] GET / -> http://www.example.com [200]
    // ? a check needs to be done to check if the response content type is application/json
    // ? then a the response body needs to be parsed and all endpoints with specific url needs to be formatted
    if (proxyRes.headers?.['set-cookie']) {
      proxyRes.headers['set-cookie'].forEach((eCookie) => {
        const cookie = eCookie.split(' path=/; secure; HttpOnly').join('');
        !this.cookies.includes(cookie) &&
          this.cookies.push(
            eCookie.split(' path=/; secure; HttpOnly').join('')
          );
      });
    }
    if (proxyRes.headers['content-type'] === 'application/hal+json') {
      const response = responseBuffer.toString('utf8');
      proxyRes.headers['content-type'] = 'application/json';
      const resBody = JSON.parse(response);
      // TODO: remove this line when login is handled
      if (resBody.token) {
        // set the token in the cookie
        this.token = resBody.token;
        this.cookies.push(`jwtToken=${this.token};`);
      }
      const formattedData = cleanUpResponse(resBody);
      return JSON.stringify(formattedData);
    }
    return responseBuffer;
  }
}
