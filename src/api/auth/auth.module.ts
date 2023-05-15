import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../../api/user/user.module';
import { Jwt } from '../../config/jwt';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auth]), UserModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, Jwt, ConfigService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'v1/api/token', method: RequestMethod.POST })
      .forRoutes(AuthController);
  }
}
