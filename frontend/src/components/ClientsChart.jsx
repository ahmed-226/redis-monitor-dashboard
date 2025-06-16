import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export const ClientsChart = ({ metricsHistory }) => (
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
);