import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, ValidateIf } from 'class-validator';

enum GrantType {
  client_credentials = 'client_credentials',
  refresh_token = 'refresh_token',
}

export class TokenDTO {
  @ValidateIf((o: TokenDTO) => o.grant_type === 'refresh_token')
  @IsNotEmpty()
  @ApiProperty({
    description: 'Refresh token that is returned when user logs in',
    required: false,
  })
  refresh_token: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Grant type of the token',
    required: true,
    enum: GrantType,
    enumName: 'GrantType',
  })
  @IsEnum(['client_credentials', 'refresh_token'])
  grant_type: string;
}
