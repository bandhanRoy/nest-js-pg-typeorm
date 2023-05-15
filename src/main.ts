import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { urlencoded } from 'express';
import helmet from 'helmet';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AppModule } from './app.module';
import { startAppInsight } from './config/app-insight';
import { logger } from './config/logger';
import { requestLogger } from './config/morgan';
import { swaggerConfig } from './config/swagger';
import { ROUTE_BASE_PATH, ROUTE_VERSION } from './constants/common.constants';
import { GlobalExceptionHandler } from './handlers/global_exception.handler';
import { LmsProxyService } from './api/lms_proxy/lms_proxy.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger,
    cors: true,
  });

  const httpAdapter = app.get(HttpAdapterHost);
  const configService: ConfigService = app.get(ConfigService);
  const lmsProxyService = app.get(LmsProxyService);
  // start microsoft app insight
  startAppInsight(configService);
  app.setGlobalPrefix(ROUTE_VERSION + '/' + ROUTE_BASE_PATH);
  // set up swagger
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/docs', app, document, {
    useGlobalPrefix: true,
  });
  // set up morgan
  app.use(requestLogger);
  // handle global errors
  app.useGlobalFilters(new GlobalExceptionHandler(httpAdapter, configService));
  // handle validation pipes
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  // application/x-www-form-urlencoded
  app.use(urlencoded({ extended: false }));
  // set proxy path
  app.use(
    `/${ROUTE_VERSION}/${ROUTE_BASE_PATH}/lms`,
    createProxyMiddleware(lmsProxyService.filter, lmsProxyService)
  );
  const port = Number(configService.get<string>('APP_PORT') || 3000);
  await app.listen(port);
  logger.log(`Server started successfully as ${port}`);
}
bootstrap();
