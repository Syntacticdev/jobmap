import connectRabbitMQ from "../../config/rabbitmq.config";
import { notification } from "../../types/services";
import logger from "../../utils/logger";


export async function sendPostNotification(eventType: string, payload: notification) {

    const channel = await connectRabbitMQ();

    channel.publish(
        "notification.exchange",
        eventType,
        Buffer.from(JSON.stringify({ eventType, payload })),
        { persistent: true }
    );
    logger.info(`Email Notification Sent -> Event:${eventType}`)
}
