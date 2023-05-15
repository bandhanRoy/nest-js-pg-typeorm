import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Match } from '../../../decorators/match.decorator';

class Phone {
  @MinLength(2, {
    message:
      'Area code is too short. Minimal length is $constraint1 characters, but actual is $value',
  })
  @MaxLength(4, {
    message:
      'Area code is too long. Maximum length is $constraint1 characters, but actual is $value',
  })
  @ApiProperty({
    description: 'Country code',
    required: true,
  })
  readonly area_code: string;

  @MinLength(4, {
    message:
      'Phone number is too short. Minimal length is $constraint1 characters, but actual is $value',
  })
  @MaxLength(13, {
    message:
      'Phone number is too long. Maximum length is $constraint1 characters, but actual is $value',
  })
  @ApiProperty({
    description: 'Phone number',
    required: true,
  })
  readonly number: string;
}

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({
    description: 'Email ID of the user',
    required: true,
  })
  email: string;

  @Type(() => Phone)
  @ValidateNested()
  @ApiProperty({
    description: 'Phone number of the user',
    required: true,
    type: () => Phone,
  })
  phone: Phone;

  @ApiProperty({
    description: 'User password',
    required: true,
  })
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @ApiProperty({
    description: 'User confirm password',
    required: true,
  })
  @MinLength(8)
  @MaxLength(20)
  @Match('password', { message: 'Password did not match' })
  confirm_password: string;
}
