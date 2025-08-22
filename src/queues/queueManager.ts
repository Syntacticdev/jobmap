import amqp from "amqplib"
import { Env } from "../config/env.config"


const configs = {
    exchanges: [
        { name: "notification.exchange", type: "topic" },
        { name: "email.exchange", type: "topic" }
    ],
    queues: [
        { name: "notification.post.queue", exchange: "notification.exchange", routingKey: "post.*" },
        { name: "notification.email.queue", exchange: "email.exchange", routingKey: "email.*" },
        { name: "email.auth.queue", exchange: "email.exchange", routingKey: "email.auth_code" },
        { name: "email.password.queue", exchange: "email.exchange", routingKey: "email.password_reset" }
    ]
}


let channel: any;
let connection: any;

export async function connectRabbitMQ() {
    try {
        connection = await amqp.connect(Env.RABBITMQ.URL)
        channel = await connection.createChannel()

        for (const ex of configs.exchanges) {
            await channel.assertExchange(ex.name, ex.type, { durable: true })
        }

        for (const queue of configs.queues) {
            await channel.assertQueue(queue.name, { durable: true })
            await channel.bindQueue(queue.name, queue.exchange, queue.routingKey)
        }

        console.log("Connected to RabbitMQ")

        return { channel, connection }
    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error)
    }
}

export function getChannel() {
    if (!channel) throw new Error("RabbitMQ channel not initialized yet!");
    return channel;
}

