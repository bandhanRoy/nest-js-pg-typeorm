"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cryptoUtil = void 0;
const config_1 = require("@nestjs/config");
const crypto = require("crypto");
const encrypt = (msg, algorithm = 'aes-192-cbc', ivLength = 16, key) => {
    const configService = new config_1.ConfigService();
    key = key || configService.get('CRYPTO_SECRET');
    const encKey = crypto.scryptSync(key, 'salt', 24);
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, encKey, iv);
    let encrypted = cipher.update(msg);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};
const decrypt = (encodedCipher, algorithm = 'aes-192-cbc', key) => {
    const configService = new config_1.ConfigService();
    key = key || configService.get('CRYPTO_SECRET');
    const encKey = crypto.scryptSync(key, 'salt', 24);
    const textParts = encodedCipher.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(algorithm, encKey, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};
exports.cryptoUtil = { encrypt, decrypt };
//# sourceMappingURL=crypto.util.js.map