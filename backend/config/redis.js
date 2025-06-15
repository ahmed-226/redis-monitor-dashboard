const redis = require('redis');

let redisClient;

async function connectRedis() {
    redisClient = redis.createClient({
        url: `redis://${process.env.REDIS_HOST || 'redis'}:${process.env.REDIS_PORT || 6379}`
    });

    redisClient.on('error', (err) => {
        console.log('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
        console.log('Connected to Redis');
    });

    redisClient.on('reconnecting', () => {
        console.log('Reconnecting to Redis...');
    });

    try {
        await redisClient.connect();
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }

    return redisClient;
}

module.exports = {
    connectRedis,
    getRedisClient: () => redisClient
};