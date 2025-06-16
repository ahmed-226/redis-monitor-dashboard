import React, { useState, useEffect, useCallback } from 'react';
import {Header} from './components/Header';
import {KeyMetricsGrid} from './components/KeyMetricsGrid';
import {ChartsGrid} from './components/ChartsGrid';
import {AdditionalStats} from './components/AdditionalStats';
import {KeysTable} from './components/KeysTable';
import {LoadingScreen} from './components/LoadingScreen';

function App() {
  const [metrics, setMetrics] = useState(null);
  const [metricsHistory, setMetricsHistory] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [ws, setWs] = useState(null);

  // Fetch initial metrics
  const fetchMetrics = useCallback(async () => {
    try {
      const response = await fetch('/api/redis/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
        setConnectionStatus('Connected');
        
        // Add to history for charts
        setMetricsHistory(prev => {
          const newHistory = [...prev, {
            ...data,
            time: new Date(data.timestamp).toLocaleTimeString()
          }];
          // Keep only last 20 data points
          return newHistory.slice(-20);
        });
      } else {
        setConnectionStatus('Error fetching data');
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setConnectionStatus('Connection failed');
    }
  }, []);

  // Setup WebSocket connection
  useEffect(() => {
    const websocket = new WebSocket(`ws://${window.location.hostname}/ws`);
    
    websocket.onopen = () => {
      console.log('WebSocket connected');
      setConnectionStatus('Real-time connected');
    };
    
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'metrics') {
        setMetrics(data.data);
        setMetricsHistory(prev => {
          const newHistory = [...prev, {
            ...data.data,
            time: new Date(data.data.timestamp).toLocaleTimeString()
          }];
          return newHistory.slice(-20);
        });
      }
    };
    
    websocket.onclose = () => {
      console.log('WebSocket disconnected');
      setConnectionStatus('Disconnected');
    };
    
    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('WebSocket error');
    };
    
    setWs(websocket);
    
    // Fetch initial data
    fetchMetrics();
    
    // Cleanup on unmount
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [fetchMetrics]);

  // Format bytes to human readable
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format uptime
  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (!metrics) {
    return <LoadingScreen connectionStatus={connectionStatus} />;
  }

  const hitRateData = [
    { name: 'Hits', value: metrics.keyspace_hits, color: '#00C49F' },
    { name: 'Misses', value: metrics.keyspace_misses, color: '#FF8042' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header connectionStatus={connectionStatus} metrics={metrics} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <KeyMetricsGrid metrics={metrics} formatUptime={formatUptime} />
        <ChartsGrid 
          metricsHistory={metricsHistory} 
          formatBytes={formatBytes} 
          hitRateData={hitRateData} 
          metrics={metrics} 
        />
        <AdditionalStats metrics={metrics} />
        
        {/* Add KeysTable component */}
        <div className="mt-8">
          <KeysTable />
        </div>
      </main>
    </div>
  );
}

export default App;