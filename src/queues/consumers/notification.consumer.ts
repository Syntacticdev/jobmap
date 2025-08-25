import connectRabbitMQ from "../../config/rabbitmq.config";
import notificationService from "../../services/notification.service"
export async function notificationConsumer() {
    const channel = await connectRabbitMQ();

    console.log("✅ Post consumers started");
    channel.consume("notification.post.queue", async (message) => {
        if (!message) return
        const { eventType, payload } = JSON.parse(message.content.toString());
        console.log(`📧 Received post notification [${eventType}]`);

        try {
            await notificationService.handlePostEvent(eventType, payload)
            channel.ack(message);
        } catch (error) {
            console.error("❌ Error sending password reset email:", error);
            channel.nack(message, false, false);
        }
    });
}
