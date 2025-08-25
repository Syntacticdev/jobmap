import connectRabbitMQ from "../../config/rabbitmq.config";
import emailService from "../../services/email.service";

export async function emailConsumer() {
    const channel = await connectRabbitMQ();

    console.log("✅ Email consumers started");
    channel.consume("notification.email.queue", async (message) => {
        if (!message) return
        const { eventType, payload } = JSON.parse(message.content.toString());
        console.log(`📧 Received email notification [${eventType}]:`, payload);

        // Handle different email events
        switch (eventType) {
            case "email.auth_code":
                await emailService.sendAuthCode({ to: "", otp: 1222 })
                break;
            case "email.welcome":
                await emailService.sendWelcomeEmail(payload.to, payload.name);
                break;
            case "email.password_reset":
                await emailService.sendPasswordResetCode()
                break;
            default:
                console.warn(`Unknown email event type: ${eventType}`);
        }

        channel.ack(message);
    });
}
