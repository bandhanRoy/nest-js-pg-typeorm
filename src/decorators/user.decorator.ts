import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserRequestType } from '../@types';

// method extracts the user document that is set by the auth middleware
// if user is not found then it throws access denied error
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserRequestType => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) throw new ForbiddenException('Access denied');
    return request.user;
  }
);
