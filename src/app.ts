// App Server Build

import express, { type Request, type Response, type Application } from 'express';
import { notificationSchema } from './api/validation.js';
import { notificationProducer } from './rabbitmq/producer.js';

const app: Application = express();

// Middleware to parse json body
app.use(express.json());

// Basic health check route
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', service: 'NotifyFlow-Producer' });
});

app.post('/send', async (req: Request, res: Response) => {
    try {
        // 1. Validate Input
        const validatedData = notificationSchema.parse(req.body);

        // 2. Send to RabbitMQ
        await notificationProducer.sendNotification(validatedData);

        // 3. Respond immediately (Async processing)
        res.status(202).json({
            status: 'accepted',
            message: 'Notification queued successfully',
        });

    } catch (error: any) {
        // Handle Validation Errors
        if (error.name === 'ZodError') {
            res.status(400).json({ error: 'Validation Error', details: error.errors });
            return;
        }

        console.error('API Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default app;