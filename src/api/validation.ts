import { z } from 'zod';

export const notificationSchema = z.object({
    type: z.enum(['email', 'sms', 'push']),
    to: z.string().min(1, "Recipient is required"), // email, address, phone number or token
    content: z.string().min(1, "Content is required"),
    metadata: z.record(z.string(), z.any()).optional(), // for extra data like subject, template, etc.

});

export type NotificationPayload = z.infer<typeof notificationSchema>;