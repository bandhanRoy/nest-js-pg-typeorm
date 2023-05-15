import { HttpStatus } from '@nestjs/common';

export type SuccessResponseType<T> = {
  statusCode: HttpStatus;
  message: string;
  result: T;
};

export type ErrorResponseType<T> = Omit<SuccessResponseType<null>, 'result'> & {
  errors: null | unknown;
  path: string;
  timestamp: string;
} & T extends true
  ? {
      errorInfo: null | unknown;
    }
  : Record<string, unknown>;

export type UserRequestType = {
  email: string;
  userId: string;
  exp: number;
  aud: string;
  iss: string;
  sub: string;
};
