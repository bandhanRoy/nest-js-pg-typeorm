"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const morgan = require("morgan");
const logger_1 = require("./logger");
exports.requestLogger = morgan('combined', {
    stream: { write: (message) => logger_1.logger.log(message.trim()) },
});
//# sourceMappingURL=morgan.js.map