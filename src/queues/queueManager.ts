import amqp from "amqplib"
import { Env } from "../config/env.config"
import { logger } from "@sentry/node";


const configs = {
    exchanges: [
        { name: "notification.exchange", type: "topic" },
        { name: "email.exchange", type: "topic" }
    ],
    queues: [
        { name: "notification.post.queue", exchange: "notification.exchange", routingKey: "post.*" },
        { name: "notification.email.queue", exchange: "email.exchange", routingKey: "email.*" },
        // { name: "email.auth.queue", exchange: "email.exchange", routingKey: "email.auth_code" },
        // { name: "email.password.queue", exchange: "email.exchange", routingKey: "email.password_reset" }
    ]
}


let channel: any;
let connection: any;

export async function setupQueues() {
    try {
        connection = await amqp.connect(Env.RABBITMQ.URL)
        channel = await connection.createChannel()

        for (const ex of configs.exchanges) {
            await channel.assertExchange(ex.name, ex.type, { durable: true })
            logger.info(`Exchange declared: ${ex.name} (${ex.type})`);
        }

        for (const queue of configs.queues) {
            await channel.assertQueue(queue.name, { durable: true })
            await channel.bindQueue(queue.name, queue.exchange, queue.routingKey)
            logger.info(`Queue declared & bound: ${queue.name} -> ${queue.exchange} (${queue.routingKey})`);
        }

        logger.info("Connected to RabbitMQ")

        return { channel }
    } catch (error) {
        logger.error(`RabbitMQ initialization failed:${error}`);
    }
}

