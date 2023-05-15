import { ConfigService } from '@nestjs/config';
export declare class MailerService {
    private readonly configService;
    private transporter;
    private readonly accessToken;
    constructor(configService: ConfigService);
    sendEmail(to: string, subject: string, text: string): Promise<any>;
}
