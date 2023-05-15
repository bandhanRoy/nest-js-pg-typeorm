"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer_1 = require("nodemailer");
const googleapis_1 = require("googleapis");
const config_1 = require("@nestjs/config");
let MailerService = class MailerService {
    constructor(configService) {
        this.configService = configService;
        const auth = new googleapis_1.google.auth.OAuth2(this.configService.get('OAUTH_CLIENT_ID'), this.configService.get('OAUTH_CLIENT_SECRET'), this.configService.get('OAUTH_REDIRECT_URI'));
        auth.setCredentials({
            refresh_token: this.configService.get('OAUTH_REFRESH_TOKEN'),
        });
        this.accessToken = auth.getAccessToken();
        this.transporter = (0, nodemailer_1.createTransport)({
            host: this.configService.get('MAIL_HOST'),
            port: this.configService.get('MAIL_PORT'),
            secure: true,
            auth: {
                type: 'OAuth2',
                user: this.configService.get('MAIL_USERNAME'),
                clientId: this.configService.get('OAUTH_CLIENT_ID'),
                clientSecret: this.configService.get('OAUTH_CLIENT_SECRET'),
                refreshToken: this.configService.get('OAUTH_REFRESH_TOKEN'),
                accessToken: this.accessToken,
            },
        });
    }
    async sendEmail(to, subject, text) {
        const mailOptions = {
            from: 'dont reply <hey.dontreply@gmail.com>',
            to,
            subject,
            text,
        };
        return await this.transporter.sendMail(mailOptions);
    }
};
MailerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailerService);
exports.MailerService = MailerService;
//# sourceMappingURL=mail.js.map