import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Jwt } from '../config/jwt';
import { logger } from '../config/logger';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwt: Jwt) {}
  use(req: Request, res: Response, next: NextFunction) {
    logger.log(`${this.constructor.name}.use: Inside auth middleware`);
    // check if token exits
    if (!req.headers.authorization)
      throw new UnauthorizedException('Unauthorized');
    req['user'] = this.jwt.verify(req.headers.authorization.split(' ')[1]);
    next();
  }
}
