export const LoadingScreen = ({ connectionStatus }) => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading Redis metrics...</p>
      <p className="text-sm text-gray-500">{connectionStatus}</p>
    </div>
  </div>
);