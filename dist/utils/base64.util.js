"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64 = void 0;
const decode = (str) => Buffer.from(str, 'base64').toString('binary');
const encode = (str) => Buffer.from(str, 'binary').toString('base64');
exports.base64 = { encode, decode };
//# sourceMappingURL=base64.util.js.map