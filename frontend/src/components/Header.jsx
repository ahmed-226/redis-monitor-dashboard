export const Header = ({ connectionStatus, metrics }) => (
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
            <p className="font-medium">{metrics?.redis_version || 'Unknown'}</p>
          </div>
        </div>
      </div>
    </div>
  </header>
);
