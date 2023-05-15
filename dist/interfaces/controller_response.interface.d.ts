import { IPaginationResult } from './pagination_result.interface';
export interface IGenericResponse<T> {
    message?: string;
    result: T;
}
export type IGenericPaginationResponse<T> = IGenericResponse<{
    result: {
        data: T;
        metaData: IPaginationResult;
    };
}>;
