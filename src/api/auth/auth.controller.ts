import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBasicAuth,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UserRequestType } from '../../@types';
import { ExtractKeyFromRequest } from '../../decorators/custom_request_data.decorator';
import { User } from '../../decorators/user.decorator';
import { TransformResponseInterceptor } from '../../interceptors/response.interceptor';
import { IGenericResponse } from '../../interfaces/controller_response.interface';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDTO } from './dto/refresh.dto';
import { AccessTokenResponse } from './responses/access_token.response';
import { RefreshTokenResponse } from './responses/refresh_token.response';
import { base64 } from '../../utils/base64.util';
import { TokenDTO } from './dto/token.dto';
import { ErrorResponse } from './responses/error.response';

@ApiTags('auth')
@Controller('token')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiBasicAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    status: 200,
    description: 'Logged in successfully',
    type: AccessTokenResponse,
  })
  @ApiOkResponse({
    status: 200,
    description: 'Access token is refresh successfully',
    type: RefreshTokenResponse,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Credentials do not match.',
    type: ErrorResponse,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorResponse,
  })
  @HttpCode(200)
  async getAccessToken(
    @Body() generateTokenPayload: TokenDTO,
    @Headers('authorization') accessToken: string,
    @ExtractKeyFromRequest('hostname') host: string,
    @ExtractKeyFromRequest('originalUrl') url: string
  ) {
    // check if the token payload has client credentials
    if (generateTokenPayload.grant_type === 'refresh_token')
      return await this.refresh(generateTokenPayload, accessToken, host, url);

    // base 64 decode
    const token = base64.decode(accessToken.split(' ')[1]);

    const [username, password] = token.split(':');

    return await this.login({ password, username }, host, url);
  }

  private async login(
    @Body() loginBody: LoginDto,
    @ExtractKeyFromRequest('hostname') host: string,
    @ExtractKeyFromRequest('originalUrl') url: string
  ): Promise<AccessTokenResponse> {
    return await this.authService.login(loginBody, host, url);
  }

  private async refresh(
    @Body() refreshBody: RefreshDTO,
    @Headers('authorization') accessToken: string,
    @ExtractKeyFromRequest('hostname') host: string,
    @ExtractKeyFromRequest('originalUrl') url: string
  ): Promise<RefreshTokenResponse> {
    return await this.authService.refresh(
      refreshBody.refresh_token,
      accessToken.split(' ')[1],
      host,
      url
    );
  }

  @Delete()
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'Deleted successfully',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Access denied.',
  })
  @UseInterceptors(TransformResponseInterceptor)
  async logout(
    @Headers('authorization') accessToken: string,
    @User() user: UserRequestType
  ) {
    return {
      message: 'Deleted successfully.',
      result: await this.authService.logout(accessToken, user),
    };
  }

  @Get('verify')
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'Success.',
    type: RefreshTokenResponse,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Access denied.',
  })
  @UseInterceptors(TransformResponseInterceptor)
  async verify(
    @Headers('authorization') accessToken: string,
    @User() user: UserRequestType
  ): Promise<IGenericResponse<null>> {
    await this.authService.verify(accessToken.split(' ')[1], user);
    return { result: null };
  }
}
