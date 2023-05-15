import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SuccessResponseType } from '../@types';
export declare class TransformResponseInterceptor<T> implements NestInterceptor<T, SuccessResponseType<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<SuccessResponseType<T>>;
}
