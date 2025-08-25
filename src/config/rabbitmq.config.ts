import amqp from "amqplib"
import { Env } from "./env.config"

let channel, connection

async function connectRabbitMQ(): Promise<amqp.Channel> {

    try {
        connection = await amqp.connect(Env.RABBITMQ.URL)
        channel = await connection.createChannel()

        return channel
    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error)
        throw new Error("Failed to connect to RabbitMQ")
    }
}

// const getChannel = async () => {
//     const connection = await connectRabbitMQ();
//     if (!connection || !connection.channel) {
//         throw new Error("Failed to connect to RabbitMQ or channel is undefined.");
//     }
//     return connection.channel;
// }
// export { connectRabbitMQ, getChannel }

export default connectRabbitMQ;
