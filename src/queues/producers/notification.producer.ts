import connectRabbitMQ from "../../config/rabbitmq.config";
import { notification } from "../../types/services";


export async function sendPostNotification(eventType: string, payload: notification) {

    const channel = await connectRabbitMQ();

    channel.publish(
        "notification.exchange",
        eventType,
        Buffer.from(JSON.stringify({ eventType, payload })),
        { persistent: true }
    );
    console.log(`📤 notification sent`);
    // console.log(`📤 Sent notification [${eventType}]:`, payload);
}


// ex.

// publishNotification("post.created", { postId: 123, userId: 45 });
// publishNotification("post.liked", { postId: 123, userId: 78 });

