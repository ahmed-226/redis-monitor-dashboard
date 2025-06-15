const express = require('express');
const cors = require('cors');
const http = require('http');
const { setupWebSocketServer } = require('../websocket/wsServer');
const { connectRedis } = require('../config/redis');
const metricsController = require('../controllers/metricsController');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

setupWebSocketServer(server);

connectRedis();

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/redis/info', metricsController.getRedisInfo);
app.get('/api/redis/metrics', metricsController.getMetrics);
app.get('/api/redis/keys', metricsController.getKeysCount);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Redis Monitor Backend running on port ${PORT}`);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  const { redisClient } = require('../config/redis');
  await redisClient.quit();
  server.close();
});