import * as amqp from 'amqplib';
import { config } from '../config/index.js';

class RabbitMQClient {
    private static instance: RabbitMQClient;
    private connection: any | null = null; // Using any to bypass complex amqplib type issues
    private channel: any | null = null;

    private constructor() { }

    public static getInstance(): RabbitMQClient {
        if (!RabbitMQClient.instance) {
            RabbitMQClient.instance = new RabbitMQClient();
        }
        return RabbitMQClient.instance;
    }

    public async connect(): Promise<void> {
        if (this.connection) return;

        console.log('Connecting to RabbitMQ...');
        this.connection = await amqp.connect(config.rabbitMQ.url);
        this.channel = await this.connection.createChannel();
        console.log('RabbitMQ Connected');
    }

    public getChannel(): amqp.Channel {
        if (!this.channel) {
            throw new Error('RabbitMQ channel not initialized. Call connect() first.');
        }
        return this.channel;
    }
}

export default RabbitMQClient.getInstance();
