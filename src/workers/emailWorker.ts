import nodemailer from 'nodemailer';
import type { NotificationPayload } from '../api/validation.js';
import { config } from '../config/index.js';

export class EmailWorker {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.email.user,
                pass: config.email.pass,
            },
        });
    }

    async send(notification: NotificationPayload): Promise<void> {
        console.log(`📧 [EmailWorker] Sending REAL email to: ${notification.to}`);

        try {
            const info = await this.transporter.sendMail({
                from: config.email.user,
                to: notification.to,
                subject: notification.metadata?.subject || 'Notification from NotifyFlow',
                text: notification.content,
            });

            console.log(`✅ [EmailWorker] Email sent successfully! Message ID: ${info.messageId}`);
        } catch (error) {
            console.error(`❌ [EmailWorker] Failed to send email:`, error);
            throw error;
        }
    }
}

export const emailWorker = new EmailWorker();
