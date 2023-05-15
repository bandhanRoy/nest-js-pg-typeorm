import * as moment from 'moment';

/**
 * "Update a date with a string, and return a moment object."
 *
 * The function takes in a date, a string, and two numbers. The string is a time unit, like "1h" or
 * "2d". The two numbers are a default amount and a default unit of time
 * @param {Date} date - Date - the date to update
 * @param {string} updateTime - string - the time to update the date by.
 * @param {number} defaultUpdateAmount - number
 * @param defaultUpdateUnit - moment.unitOfTime.DurationConstructor
 * @param {'add' | 'subtract'} [operation=add] - 'add' | 'subtract' = 'add'
 * @returns A function that takes in a date, update time, default update amount, default update unit,
 * and an operation.
 */
export const updateDateTime = (
  date: Date,
  updateTime: string,
  defaultUpdateAmount: number,
  defaultUpdateUnit: moment.unitOfTime.DurationConstructor,
  operation: 'add' | 'subtract' = 'add'
): moment.Moment => {
  const mtDt = moment(date);
  const [_, unitOfTime] = updateTime.split(/^\d+/);
  const amount = Number(updateTime.split(unitOfTime)[0]);
  // split update time
  let updateDt = mtDt[operation](
    amount,
    unitOfTime as moment.unitOfTime.DurationConstructor
  );
  if (!updateDt.isValid())
    updateDt = mtDt[operation](defaultUpdateAmount, defaultUpdateUnit);

  return updateDt;
};

export const currDate = (): Date => {
  return new Date();
};
