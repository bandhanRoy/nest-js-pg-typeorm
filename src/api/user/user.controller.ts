import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SuccessResponseType } from '../../@types';
import { TransformResponseInterceptor } from '../../interceptors/response.interceptor';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOkResponse({
    status: 201,
    description: 'User added successfully',
  })
  @ApiConflictResponse({
    status: 409,
    description: 'User already exists.',
  })
  @UseInterceptors(TransformResponseInterceptor)
  async create(
    @Body() createUserDto: CreateUserDto
  ): Promise<SuccessResponseType<null>> {
    await this.userService.create(createUserDto);
    return {
      statusCode: 201,
      message: 'User added successfully',
      result: null,
    };
  }

  @Get('activate')
  @ApiOkResponse({
    status: 200,
    description: 'User activated successfully',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @HttpCode(200)
  async activateLogin(
    @Query('token') token: string
  ): Promise<SuccessResponseType<null>> {
    const result = await this.userService.activateLogin(token);
    if (!result) throw new UnauthorizedException('Unauthorized');
    return {
      statusCode: 201,
      message: 'User activated successfully',
      result: null,
    };
  }
}
