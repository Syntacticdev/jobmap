import amqp from "amqplib"
import { Env } from "./env.config"

let channel, connection

async function connectRabbitMQ() {
    try {
        connection = await amqp.connect(Env.RABBITMQ.URL)
        channel = await connection.createChannel()
        console.log("Connected to RabbitMQ")

        return { channel, connection }
    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error)
    }
}

export default connectRabbitMQ
