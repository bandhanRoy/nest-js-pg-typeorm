import * as moment from 'moment';
export declare const updateDateTime: (date: Date, updateTime: string, defaultUpdateAmount: number, defaultUpdateUnit: moment.unitOfTime.DurationConstructor, operation?: 'add' | 'subtract') => moment.Moment;
export declare const currDate: () => Date;
