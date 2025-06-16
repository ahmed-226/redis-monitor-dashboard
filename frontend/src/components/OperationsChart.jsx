import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export const OperationsChart = ({ metricsHistory }) => (
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
);