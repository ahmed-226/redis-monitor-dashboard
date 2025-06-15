const WebSocket = require('ws');
const metricsService = require('../services/metricsService');

const clients = new Set();


function setupWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected');
    clients.add(ws);
    
    ws.on('close', () => {
      console.log('Client disconnected');
      clients.delete(ws);
    });
  });

  startMetricsBroadcast();
}


function broadcast(data) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}


function startMetricsBroadcast() {
  setInterval(async () => {
    if (clients.size > 0) {
      const metrics = await metricsService.getMetrics();
      if (metrics) {
        broadcast({
          type: 'metrics',
          data: metrics
        });
      }
    }
  }, 5000); 
}

module.exports = {
  setupWebSocketServer,
  broadcast
};