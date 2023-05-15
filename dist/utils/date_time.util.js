"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currDate = exports.updateDateTime = void 0;
const moment = require("moment");
const updateDateTime = (date, updateTime, defaultUpdateAmount, defaultUpdateUnit, operation = 'add') => {
    const mtDt = moment(date);
    const [_, unitOfTime] = updateTime.split(/^\d+/);
    const amount = Number(updateTime.split(unitOfTime)[0]);
    let updateDt = mtDt[operation](amount, unitOfTime);
    if (!updateDt.isValid())
        updateDt = mtDt[operation](defaultUpdateAmount, defaultUpdateUnit);
    return updateDt;
};
exports.updateDateTime = updateDateTime;
const currDate = () => {
    return new Date();
};
exports.currDate = currDate;
//# sourceMappingURL=date_time.util.js.map