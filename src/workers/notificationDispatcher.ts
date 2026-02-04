import { Worker } from './worker.js';
import type { NotificationPayload } from '../api/validation.js';
import { emailWorker } from './emailWorker.js';
import { smsWorker } from './smsWorker.js';

export class NotificationDispatcher extends Worker {
    protected queueName = 'notifications';

    async process(data: NotificationPayload): Promise<void> {
        console.log(`[Dispatcher] Processing ${data.type} notification...`);

        switch (data.type) {
            case 'email':
                await emailWorker.send(data);
                break;
            case 'sms':
                await smsWorker.send(data);
                break;
            case 'push':
                console.log('Push notifications not yet implemented');
                break;
            default:
                console.warn(`[Dispatcher] Unknown notification type: ${(data as any).type}`);
        }
    }
}

export const notificationDispatcher = new NotificationDispatcher();
