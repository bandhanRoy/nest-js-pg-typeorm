"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConfig = void 0;
const path = require("path");
const DBConfig = (configService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [path.join(__dirname, '..', '/api/**/**/*.entity{.ts,.js}')],
    synchronize: true,
    ssl: String(configService.get('DB_SSL')) === 'true',
});
exports.DBConfig = DBConfig;
//# sourceMappingURL=db.js.map