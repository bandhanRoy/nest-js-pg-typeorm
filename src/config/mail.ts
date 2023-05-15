import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { google, Auth } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private transporter: Transporter;
  private readonly accessToken;
  constructor(private readonly configService: ConfigService) {
    const auth: Auth.OAuth2Client = new google.auth.OAuth2(
      this.configService.get<string>('OAUTH_CLIENT_ID'),
      this.configService.get<string>('OAUTH_CLIENT_SECRET'),
      this.configService.get<string>('OAUTH_REDIRECT_URI')
    );

    auth.setCredentials({
      refresh_token: this.configService.get<string>('OAUTH_REFRESH_TOKEN'),
    });
    this.accessToken = auth.getAccessToken();
    this.transporter = createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: true,
      auth: {
        type: 'OAuth2',
        user: this.configService.get<string>('MAIL_USERNAME'),
        clientId: this.configService.get<string>('OAUTH_CLIENT_ID'),
        clientSecret: this.configService.get<string>('OAUTH_CLIENT_SECRET'),
        refreshToken: this.configService.get<string>('OAUTH_REFRESH_TOKEN'),
        accessToken: this.accessToken,
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: 'dont reply <hey.dontreply@gmail.com>',
      to,
      subject,
      text,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
