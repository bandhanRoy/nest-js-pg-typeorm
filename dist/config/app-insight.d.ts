import { ConfigService } from '@nestjs/config';
import * as appInsight from 'applicationinsights';
export declare const startAppInsight: (configService: ConfigService) => typeof appInsight.Configuration;
