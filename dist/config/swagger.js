"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerConfig = void 0;
const swagger_1 = require("@nestjs/swagger");
exports.swaggerConfig = new swagger_1.DocumentBuilder()
    .setTitle('Nest JS POC')
    .setDescription('The nest js poc description')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('user')
    .addTag('health')
    .addBearerAuth()
    .build();
//# sourceMappingURL=swagger.js.map