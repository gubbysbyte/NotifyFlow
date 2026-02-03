import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    postgres: {
        user: process.env.POSTGRES_USER || 'user',
        host: process.env.POSTGRES_HOST || 'localhost',
        database: process.env.POSTGRES_DB || 'notifyflow',
        password: process.env.POSTGRES_PASSWORD || 'password',
        port: 5432,
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: 6379,
    },
    rabbitMQ: {
        url: process.env.RABBITMQ_URL || 'amqp://user:password@localhost:5672',
    },
};