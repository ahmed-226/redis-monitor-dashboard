const { getRedisClient } = require('../config/redis');
const { parseRedisInfo } = require('../utils/redisParser');


async function getRedisInfo() {
  try {
    const redisClient = getRedisClient();
    const info = await redisClient.info();
    const memory = await redisClient.info('memory');
    const keyspace = await redisClient.info('keyspace');
    
    return {
      info: parseRedisInfo(info),
      memory: parseRedisInfo(memory),
      keyspace: parseRedisInfo(keyspace)
    };
  } catch (error) {
    console.error('Error getting Redis info:', error);
    return null;
  }
}


async function getMetrics() {
  try {
    const info = await getRedisInfo();
    if (!info) return null;

    const timestamp = Date.now();
    
    return {
      timestamp,
      connected_clients: info.info.connected_clients || 0,
      used_memory: info.memory.used_memory || 0,
      used_memory_human: info.memory.used_memory_human || '0B',
      keyspace_hits: info.info.keyspace_hits || 0,
      keyspace_misses: info.info.keyspace_misses || 0,
      total_commands_processed: info.info.total_commands_processed || 0,
      instantaneous_ops_per_sec: info.info.instantaneous_ops_per_sec || 0,
      uptime_in_seconds: info.info.uptime_in_seconds || 0,
      redis_version: info.info.redis_version || 'unknown'
    };
  } catch (error) {
    console.error('Error getting metrics:', error);
    return null;
  }
}


async function getKeysCount() {
  try {
    const redisClient = getRedisClient();
    return await redisClient.dbSize();
  } catch (error) {
    console.error('Error getting keys count:', error);
    return 0;
  }
}

async function getKeyValues(pattern = '*', limit = 100) {
  try {
    const redisClient = getRedisClient();
    const keys = await redisClient.keys(pattern);
    const limitedKeys = keys.slice(0, limit);
    
    const result = [];
    for (const key of limitedKeys) {
      const type = await redisClient.type(key);
      let value;
      
      switch(type) {
        case 'string':
          value = await redisClient.get(key);
          break;
        case 'list':
          value = await redisClient.lRange(key, 0, 9); // First 10 elements
          break;
        case 'set':
          value = await redisClient.sMembers(key);
          break;
        case 'hash':
          value = await redisClient.hGetAll(key);
          break;
        case 'zset':
          value = await redisClient.zRange(key, 0, 9); // First 10 elements
          break;
        default:
          value = `Unsupported type: ${type}`;
      }
      
      result.push({
        key,
        type,
        value,
        ttl: await redisClient.ttl(key)
      });
    }
    
    return {
      totalKeys: keys.length,
      displayedKeys: result.length,
      keys: result
    };
  } catch (error) {
    console.error('Error getting key values:', error);
    return {
      totalKeys: 0,
      displayedKeys: 0,
      keys: []
    };
  }
}


module.exports = {
  getRedisInfo,
  getMetrics,
  getKeysCount,
  getKeyValues
};