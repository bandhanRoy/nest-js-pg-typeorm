import { ConfigService } from '@nestjs/config';
import { HealthCheckService, HttpHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';
export declare class HealthController {
    private health;
    private http;
    private db;
    private readonly configService;
    constructor(health: HealthCheckService, http: HttpHealthIndicator, db: TypeOrmHealthIndicator, configService: ConfigService);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult>;
}
