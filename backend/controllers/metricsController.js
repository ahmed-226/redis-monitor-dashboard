const metricsService = require('../services/metricsService');


async function getRedisInfo(req, res) {
  try {
    const info = await metricsService.getRedisInfo();
    if (!info) {
      return res.status(500).json({ error: 'Failed to get Redis info' });
    }
    res.json(info);
  } catch (error) {
    console.error('Error in Redis info controller:', error);
    res.status(500).json({ error: 'Failed to get Redis info' });
  }
}


async function getMetrics(req, res) {
  try {
    const metrics = await metricsService.getMetrics();
    if (!metrics) {
      return res.status(500).json({ error: 'Failed to get Redis metrics' });
    }
    res.json(metrics);
  } catch (error) {
    console.error('Error in metrics controller:', error);
    res.status(500).json({ error: 'Failed to get Redis metrics' });
  }
}


async function getKeysCount(req, res) {
  try {
    const keys = await metricsService.getKeysCount();
    res.json({ total_keys: keys });
  } catch (error) {
    console.error('Error in keys count controller:', error);
    res.status(500).json({ error: 'Failed to get keys count' });
  }
}

module.exports = {
  getRedisInfo,
  getMetrics,
  getKeysCount
};