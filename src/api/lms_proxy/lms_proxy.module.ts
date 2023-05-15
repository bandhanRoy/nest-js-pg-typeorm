import { Module } from '@nestjs/common';
import { LmsProxyService } from './lms_proxy.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [ConfigService, LmsProxyService],
})
export class LmsProxyModule {}
