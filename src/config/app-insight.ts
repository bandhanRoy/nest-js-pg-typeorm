import { ConfigService } from '@nestjs/config';
import * as appInsight from 'applicationinsights';

export const startAppInsight = (configService: ConfigService) => {
  // if node env is local then do not log in app insight
  if (configService.get<string>('ENV') === 'LOCAL') return;
  return appInsight
    .setup(configService.get<string>('APP_INSIGHT_CONN'))
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true, true)
    .setSendLiveMetrics(false)
    .setDistributedTracingMode(appInsight.DistributedTracingModes.AI)
    .start();
};
