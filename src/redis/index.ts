import { createClient, type RedisClientType } from 'redis';
import { config } from '../config/index.js';

const redis: RedisClientType = createClient({
    socket: {
        host: config.redis.host,
        port: config.redis.port,
    },
});

redis.on('error', (err) => console.log('Redis Client Error', err));

export const connectRedis = async (): Promise<typeof redis> => {
    if (!redis.isOpen) {
        await redis.connect();
        console.log('Redis Connected');
    }
    return redis;
};

export default redis;