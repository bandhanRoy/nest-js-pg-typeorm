import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { HealthModule } from './api/health/health.module';
import { UserModule } from './api/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBConfig } from './config/db';
import { LmsProxyModule } from './api/lms_proxy/lms_proxy.module';

@Module({
  imports: [
    AuthModule,
    HealthModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        DBConfig(configService),
      inject: [ConfigService],
    }),
    UserModule,
    LmsProxyModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, ConfigService],
})
export class AppModule {}
