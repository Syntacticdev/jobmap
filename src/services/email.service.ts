import transporter from "../config/email.config";
import getOtp from "../utils/get-otp";
import mjml2html from "mjml";
import fs from "fs";
import path from "path";

export default {

    sendAuthCode: async (param: { to: string; otp: number }) => {
        let { otp, expirationTime } = getOtp();


        // let mailGenerator = new Mailgen({
        //     theme: 'default',
        //     product: {
        //         // Appears in header & footer of e-mails
        //         name: 'MyGuy',
        //         link: 'https://mailgen.js/',
        //         // Optional product logo
        //         logo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'
        //     }
        // });

        // let email = {
        //     body: {
        //         signature: false,
        //         title: 'Verification OTP',
        //         intro: param.otp,
        //         action: {
        //             instructions: 'To verify your account, please click here:',
        //             button: {
        //                 color: '#22BC66', // Optional action button color
        //                 text: 'Verify your account',
        //                 link: 'https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010'
        //             }
        //         },
        //         outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        //     }
        // };

        // // Generate an HTML email with the provided contents
        // let emailBody = mailGenerator.generate(email);


        // const info = await transporter.sendMail({
        //     from: process.env.PASS,
        //     to: param.to,
        //     subject: "OTP Verification - MyGuy", // 
        //     text: "Verify your account",
        //     html: emailBody
        // });

        // console.log("Message sent: %s", info.messageId);



    },

    async sendPasswordResetCode() {

    },

    async sendWelcomeEmail(to: string, name: string) {
        const templatePath = path.join(__dirname, "templates", "welcome.mjml");
        let mjmlTemplate = fs.readFileSync(templatePath, "utf-8");
        mjmlTemplate = mjmlTemplate.replace("{{name}}", name);
        const { html } = mjml2html(mjmlTemplate);

        const info = await transporter.sendMail({
            from: 'no-reply@jobmap.com',
            to,
            subject: 'Welcome to JobMap!',
            html
        });
        console.log("Message sent: %s", info.messageId);
    }
}