/// <reference types="qs" />
import { Request } from 'express';
export declare const ExtractKeyFromRequest: (...dataOrPipes: (keyof Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>>)[]) => ParameterDecorator;
