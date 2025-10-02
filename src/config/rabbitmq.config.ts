import amqp from "amqplib"
import { Env } from "./env.config"
import logger from "../utils/logger"

let channel, connection

async function connectRabbitMQ(): Promise<amqp.Channel> {

    try {
        connection = await amqp.connect(Env.RABBITMQ.URL)
        channel = await connection.createChannel()

        return channel
    } catch (error) {
        logger.error(`Error connecting to RabbitMQ:${error}`)
        throw new Error("Failed to connect to RabbitMQ")
    }
}

export default connectRabbitMQ;
