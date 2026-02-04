import { notificationDispatcher } from './workers/notificationDispatcher.js';
import rabbitmqClient from './rabbitmq/client.js';

const startConsumer = async () => {
    try {
        console.log('[Consumer] Starting Notification Consumer...');

        // Ensure connection is established first
        await rabbitmqClient.connect();

        // Start the worker
        await notificationDispatcher.start();

        console.log('[Consumer] Worker started successfully.');
    } catch (error) {
        console.error('[Consumer] Failed to start consumer:', error);
        process.exit(1);
    }
};

startConsumer();
