import rabbitmqClient from '../rabbitmq/client.js';
import type { NotificationPayload } from '../api/validation.js';

export abstract class Worker {
    protected abstract queueName: string;

    constructor() { }

    /**
     * Connects to RabbitMQ and starts consuming messages from the queue.
     */
    public async start(): Promise<void> {
        try {
            const channel = rabbitmqClient.getChannel();

            await channel.assertQueue(this.queueName, {
                durable: true
            });

            console.log(`[Worker] Listening on queue: ${this.queueName}`);

            channel.consume(this.queueName, async (msg) => {
                if (msg) {
                    try {
                        const content = JSON.parse(msg.content.toString()) as NotificationPayload;

                        console.log(`[Worker] Received message from ${this.queueName}`);

                        await this.process(content);

                        // Acknowledge upon success
                        channel.ack(msg);
                    } catch (err) {
                        console.error(`[Worker] Error processing message:`, err);
                        // Negative Acknowledge (re-queue false for now to avoid infinite loops on bad data)
                        // In Phase 5 we will add DLQ logic here.
                        channel.nack(msg, false, false);
                    }
                }
            });

        } catch (error) {
            console.error(`[Worker] Failed to start worker for queue ${this.queueName}`, error);
            // Optionally throw or exit, but for now just log.
        }
    }

    /**
     * The specific logic for processing the notification (Email, SMS, etc.)
     * Must be implemented by concrete classes.
     */
    protected abstract process(data: NotificationPayload): Promise<void>;
}
