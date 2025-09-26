import connectRabbitMQ from "../../config/rabbitmq.config";
// import { payload } from "../../types/services";


export async function sendEmailNotificationQueue(eventType: string, payload: any) {
    const channel = await connectRabbitMQ();

    channel.publish(
        "email.exchange",
        eventType,
        Buffer.from(JSON.stringify({ eventType, payload })),
        { persistent: true }
    );
    console.log("📧 Sent email notification:", { eventType, payload });
}



// ex.

// publishEmail("email.auth_code", { email: "user@mail.com", code: "123456" });
// publishEmail("email.password_reset", { email: "user@mail.com", resetToken: "abcd" });
