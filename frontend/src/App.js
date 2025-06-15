import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import './index.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Redis metrics...</p>
          <p className="text-sm text-gray-500">{connectionStatus}</p>
        </div>
      </div>
    );
  }

  const hitRateData = [
    { name: 'Hits', value: metrics.keyspace_hits, color: '#00C49F' },
    { name: 'Misses', value: metrics.keyspace_misses, color: '#FF8042' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Redis Monitor Dashboard</h1>
              <p className="text-gray-600">Real-time Redis performance monitoring</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                connectionStatus.includes('connected') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {connectionStatus}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Redis Version</p>
                <p className="font-medium">{metrics.redis_version}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">C</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Connected Clients</dt>
                    <dd className="text-lg font-medium text-gray-900">{metrics.connected_clients}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">M</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Memory Usage</dt>
                    <dd className="text-lg font-medium text-gray-900">{metrics.used_memory_human}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">O</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Ops/sec</dt>
                    <dd className="text-lg font-medium text-gray-900">{metrics.instantaneous_ops_per_sec}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">U</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Uptime</dt>
                    <dd className="text-lg font-medium text-gray-900">{formatUptime(metrics.uptime_in_seconds)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Memory Usage Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Memory Usage Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metricsHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis tickFormatter={formatBytes} />
                <Tooltip formatter={(value) => [formatBytes(value), 'Memory']} />
                <Legend />
                <Line type="monotone" dataKey="used_memory" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Operations Per Second Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Operations Per Second</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metricsHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="instantaneous_ops_per_sec" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Connected Clients Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Connected Clients</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metricsHistory.slice(-10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="connected_clients" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Hit Rate Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cache Hit Rate</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={hitRateData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {hitRateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Total Commands: {metrics.total_commands_processed.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Statistics</h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Commands Processed</dt>
                <dd className="mt-1 text-sm text-gray-900">{metrics.total_commands_processed.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Keyspace Hits</dt>
                <dd className="mt-1 text-sm text-gray-900">{metrics.keyspace_hits.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Keyspace Misses</dt>
                <dd className="mt-1 text-sm text-gray-900">{metrics.keyspace_misses.toLocaleString()}</dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;