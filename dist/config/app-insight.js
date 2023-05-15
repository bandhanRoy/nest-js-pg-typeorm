"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAppInsight = void 0;
const appInsight = require("applicationinsights");
const startAppInsight = (configService) => {
    if (configService.get('ENV') === 'LOCAL')
        return;
    return appInsight
        .setup(configService.get('APP_INSIGHT_CONN'))
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
exports.startAppInsight = startAppInsight;
//# sourceMappingURL=app-insight.js.map