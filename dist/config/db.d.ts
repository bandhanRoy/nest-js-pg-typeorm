import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export declare const DBConfig: (configService: ConfigService) => TypeOrmModuleOptions;
