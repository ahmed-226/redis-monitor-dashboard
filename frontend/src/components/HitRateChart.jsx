import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';


export const HitRateChart = ({ hitRateData, metrics }) => (
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
);
