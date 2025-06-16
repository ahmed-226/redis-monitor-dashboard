import React, { useState, useEffect } from 'react';

export const KeysTable = () => {
  const [keyData, setKeyData] = useState({ keys: [], totalKeys: 0, displayedKeys: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pattern, setPattern] = useState('*');
  const [limit, setLimit] = useState(100);

  const fetchKeys = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/redis/key-values?pattern=${pattern}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setKeyData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchKeys();
  };

  const formatValue = (value, type) => {
    if (value === null) return 'null';
    
    if (Array.isArray(value)) {
      return value.map((item, i) => (
        <div key={i} className="pl-2 border-l-2 border-gray-300 my-1">
          {item}
        </div>
      ));
    }
    
    if (typeof value === 'object') {
      return Object.entries(value).map(([k, v]) => (
        <div key={k} className="pl-2 border-l-2 border-gray-300 my-1">
          <span className="font-semibold">{k}:</span> {v}
        </div>
      ));
    }
    
    return value;
  };

  const formatTTL = (ttl) => {
    if (ttl === -1) return 'No expiration';
    if (ttl === -2) return 'Expired';
    
    if (ttl < 60) return `${ttl} seconds`;
    if (ttl < 3600) return `${Math.floor(ttl / 60)} minutes`;
    if (ttl < 86400) return `${Math.floor(ttl / 3600)} hours`;
    return `${Math.floor(ttl / 86400)} days`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Redis Keys</h3>
        <div className="text-sm text-gray-500">
          Showing {keyData.displayedKeys} of {keyData.totalKeys} keys
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-4 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pattern</label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="* for all keys"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Limit</label>
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            min="1"
            max="1000"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Refresh
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Key
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TTL
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {keyData.keys.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.key}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTTL(item.ttl)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-md overflow-auto">
                    {formatValue(item.value, item.type)}
                  </td>
                </tr>
              ))}
              
              {keyData.keys.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No keys found matching pattern "{pattern}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
