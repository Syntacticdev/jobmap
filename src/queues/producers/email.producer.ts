import { logger } from "@sentry/node";
import connectRabbitMQ from "../../config/rabbitmq.config";

export async function sendEmailNotificationQueue(eventType: string, payload: any) {
    const channel = await connectRabbitMQ();

    channel.publish(
        "email.exchange",
        eventType,
        Buffer.from(JSON.stringify({ eventType, payload })),
        { persistent: true }
    );
    logger.info(`Email Notification Sent -> Event:${eventType}`)
}
