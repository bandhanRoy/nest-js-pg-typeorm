import { PickType } from '@nestjs/swagger';
import { AccessTokenResponse } from './access_token.response';

export class RefreshTokenResponse extends PickType(AccessTokenResponse, [
  'access_token',
  'expires_in',
  'token_type',
]) {}
