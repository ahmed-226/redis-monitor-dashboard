import React from 'react';
import { MemoryChart } from './MemoryChart';
import { OperationsChart } from './OperationsChart';
import { ClientsChart } from './ClientsChart';
import { HitRateChart } from './HitRateChart';

export const ChartsGrid = ({ metricsHistory, formatBytes, hitRateData, metrics }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <MemoryChart metricsHistory={metricsHistory} formatBytes={formatBytes} />
    <OperationsChart metricsHistory={metricsHistory} />
    <ClientsChart metricsHistory={metricsHistory} />
    <HitRateChart hitRateData={hitRateData} metrics={metrics} />
  </div>
);
