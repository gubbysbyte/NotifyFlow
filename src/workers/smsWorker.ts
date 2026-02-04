import twilio from 'twilio';
import type { NotificationPayload } from '../api/validation.js';
import { config } from '../config/index.js';

export class SMSWorker {
    private client;
    private isFromNumberValid: boolean = true;

    constructor() {
        this.client = twilio(config.sms.accountSid, config.sms.authToken);

        // Async validation to ensure configured TWILIO_FROM exists in Twilio account
        if (config.sms.fromNumber) {
            this.client.incomingPhoneNumbers
                .list({ phoneNumber: config.sms.fromNumber, limit: 1 })
                .then((numbers) => {
                    if (!numbers || numbers.length === 0) {
                        console.warn(`[SMSWorker] TWILIO_FROM ${config.sms.fromNumber} is not a Twilio-owned phone number or there is a country/short-code mismatch.`);
                        this.isFromNumberValid = false;
                    } else {
                        console.log(`[SMSWorker] TWILIO_FROM ${config.sms.fromNumber} validated with Twilio.`);
                        this.isFromNumberValid = true;
                    }
                })
                .catch((err) => {
                    console.warn(`[SMSWorker] Failed to validate TWILIO_FROM with Twilio:`, err?.message || err);
                    this.isFromNumberValid = false;
                });
        } else {
            this.isFromNumberValid = false;
        }

    }

    async send(notification: NotificationPayload): Promise<void> {
        console.log(`📱 [SMSWorker] Sending REAL SMS to: ${notification.to}`);

        if (!config.sms.fromNumber) {
            throw new Error('TWILIO_FROM environment variable is not configured');
        }

        if (!this.isFromNumberValid) {
            console.error(`❌ [SMSWorker] Configured TWILIO_FROM is not valid or not owned by Twilio: ${config.sms.fromNumber}`);
            throw new Error("Configured TWILIO_FROM is not a Twilio phone number or there is a country/short-code mismatch. Check Twilio Console (Phone Numbers) and ensure the number is purchased and supports SMS in the target country. See https://www.twilio.com/docs/errors/21659");
        }

        // Normalize numbers and prevent sending when 'to' and 'from' are identical
        const normalize = (s: string | undefined) => s ? s.replace(/[^\d+]/g, '') : '';
        const toNormalized = normalize(notification.to);
        const fromNormalized = normalize(config.sms.fromNumber);

        if (toNormalized === fromNormalized) {
            console.error(`❌ [SMSWorker] 'To' and 'From' number cannot be the same: ${notification.to}`);
            throw new Error("'To' and 'From' number cannot be the same. Use a different recipient or configure a valid TWILIO_FROM number.");
        }

        try {
            const message = await this.client.messages.create({
                body: notification.content,
                from: config.sms.fromNumber,
                to: notification.to,
            });

            console.log(`✅ [SMSWorker] SMS sent successfully! SID: ${message.sid}`);
        } catch (error: any) {
            if (error?.code === 21659) {
                console.error('❌ [SMSWorker] Twilio error 21659: "From" is not a Twilio phone number or country mismatch. Check Twilio Console: https://www.twilio.com/docs/errors/21659');
            }
            console.error(`❌ [SMSWorker] Failed to send SMS:`, error);
            throw error;
        }
    }
}

export const smsWorker = new SMSWorker();
