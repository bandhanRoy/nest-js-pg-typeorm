import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Jwt } from '../config/jwt';
export declare class AuthMiddleware implements NestMiddleware {
    private readonly jwt;
    constructor(jwt: Jwt);
    use(req: Request, res: Response, next: NextFunction): void;
}
