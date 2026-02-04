import rabbitmqClient from './client.js';
import type { NotificationPayload } from '../api/validation.js';

class NotificationProducer {
    private queueName = 'notifications';
    async sendNotification(data: NotificationPayload) {
        const channel = rabbitmqClient.getChannel();

        //Ensure the queue exists before sending
        await channel.assertQueue(this.queueName, {
            durable: true // Queue survives broker restart
        });

        const isSent = channel.sendToQueue(
            this.queueName,
            Buffer.from(JSON.stringify(data)),
            {
                persistent: true // Message survives broker restart
            }
        );

        if (isSent) {
            console.log(`[Producer] Notification enqueued for: ${data.to}`);
        } else {
            console.warn(`[Producer] Queue buffer full, message dropped!`);
        }
    }
}

export const notificationProducer = new NotificationProducer();