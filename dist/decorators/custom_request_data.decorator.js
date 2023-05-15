"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractKeyFromRequest = void 0;
const common_1 = require("@nestjs/common");
exports.ExtractKeyFromRequest = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request === null || request === void 0 ? void 0 : request[data];
});
//# sourceMappingURL=custom_request_data.decorator.js.map