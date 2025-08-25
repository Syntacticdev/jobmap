import nodemailer from "nodemailer"
import { Env } from "./env.config";

let config = {
    service: 'gmail',
    auth: {
        user: Env.EMAIL.USER,
        pass: Env.EMAIL.PASS
    }
}

const transporter = nodemailer.createTransport(config);

export default transporter;