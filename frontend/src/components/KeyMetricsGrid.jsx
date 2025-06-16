import React from "react";
import { MetricCard } from "./MetricCard";



export const KeyMetricsGrid = ({ metrics, formatUptime }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <MetricCard 
      title="Connected Clients" 
      value={metrics.connected_clients} 
      icon="C" 
      color="blue" 
    />
    <MetricCard 
      title="Memory Usage" 
      value={metrics.used_memory_human} 
      icon="M" 
      color="green" 
    />
    <MetricCard 
      title="Ops/sec" 
      value={metrics.instantaneous_ops_per_sec} 
      icon="O" 
      color="yellow" 
    />
    <MetricCard 
      title="Uptime" 
      value={formatUptime(metrics.uptime_in_seconds)} 
      icon="U" 
      color="purple" 
    />
  </div>
);