import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    description: 'Email ID of the user',
    required: true,
  })
  username: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Password of the user',
    required: true,
  })
  password: string;
}
