import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty({
    description: 'Error type',
    enum: [
      'invalid_request',
      'invalid_client',
      'invalid_grant',
      'unauthorized_client',
      'unsupported_grant_type',
      'invalid_scope',
    ],
  })
  error: string;
  @ApiProperty({
    description: 'Error description',
  })
  error_description: string;
}
