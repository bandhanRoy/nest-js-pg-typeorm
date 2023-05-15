import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenResponse {
  @ApiProperty({ description: 'Access token' })
  access_token: string;

  @ApiProperty({ description: 'Token type', default: 'Bearer' })
  token_type: 'Bearer';

  @ApiProperty({ description: 'The expiry time' })
  expires_in: number;

  @ApiProperty({ description: 'The refresh token' })
  refresh_token: string;
}
