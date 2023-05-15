import { ApiProperty } from '@nestjs/swagger';
import { Contains, IsNotEmpty } from 'class-validator';

export class RefreshDTO {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Refresh token that is returned when user logs in',
    required: true,
  })
  refresh_token: string;

  @IsNotEmpty()
  @Contains('refresh_token')
  @ApiProperty({
    description: 'Grant type of the token',
    required: true,
    default: 'refresh_token',
  })
  grant_type: string;
}
