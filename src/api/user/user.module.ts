import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { Phone } from './entities/phone.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerService } from '../../config/mail';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User, Phone])],
  controllers: [UserController],
  providers: [UserService, MailerService, ConfigService],
  exports: [UserService],
})
export class UserModule {}
