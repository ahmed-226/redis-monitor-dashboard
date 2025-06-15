/**
 * @param {string} infoString - The Redis INFO command output
 * @returns {Object} - Parsed key-value pairs
 */
function parseRedisInfo(infoString) {
  const info = {};
  
  if (!infoString) return info;
  
  infoString.split('\r\n').forEach(line => {
    if (line && !line.startsWith('#')) {
      const [key, value] = line.split(':');
      if (key && value !== undefined) {
        info[key] = isNaN(value) ? value : Number(value);
      }
    }
  });
  
  return info;
}

module.exports = {
  parseRedisInfo
};