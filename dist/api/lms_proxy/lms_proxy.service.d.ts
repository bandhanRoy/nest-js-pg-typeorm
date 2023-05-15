/// <reference types="node" />
/// <reference types="node" />
import { Options } from 'http-proxy-middleware';
import { Request, Response } from 'express';
import { Url } from 'url';
import { IncomingMessage } from 'http';
import { Filter, OnProxyReqCallback } from 'http-proxy-middleware/dist/types';
import { ConfigService } from '@nestjs/config';
export declare class LmsProxyService implements Options {
    private readonly configService;
    private token;
    private cookies;
    target: string;
    changeOrigin: boolean;
    pathRewrite: {
        [x: string]: string;
    };
    logLevel: 'debug' | 'info' | 'warn' | 'error' | 'silent';
    selfHandleResponse: boolean;
    onProxyRes: (proxyRes: IncomingMessage, req: IncomingMessage, res: import("http").ServerResponse<IncomingMessage>) => Promise<void>;
    onProxyReq: OnProxyReqCallback;
    constructor(configService: ConfigService);
    logProvider(): import("@nestjs/common").LoggerService;
    filter: Filter;
    onError(err: Error, _req: Request, res: Response, _target: string | Partial<Url>): void;
    private modifyRequest;
    private modifyResponse;
}
