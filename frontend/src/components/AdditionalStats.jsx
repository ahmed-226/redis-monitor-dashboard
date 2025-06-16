export const AdditionalStats = ({ metrics }) => (
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
);