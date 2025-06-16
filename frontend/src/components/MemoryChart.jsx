import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export const MemoryChart = ({ metricsHistory, formatBytes }) => (
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
);