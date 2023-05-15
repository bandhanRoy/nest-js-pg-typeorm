import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
export declare class GlobalExceptionHandler implements ExceptionFilter {
    private readonly httpAdapterHost;
    private readonly configService;
    constructor(httpAdapterHost: HttpAdapterHost, configService: ConfigService);
    catch(exception: unknown, host: ArgumentsHost): void;
}
