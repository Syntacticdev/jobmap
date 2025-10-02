import transporter from "../config/email.config";
import { getAuthCodeTemplate } from "./templates/authcode.template";
import { getWelcomeEmailTemplate } from "./templates/welcome.template";
import { getPasswordResetTemplate } from "./templates/passwordreset.template";
import { getWeeklySummaryTemplate, JobInfo, JobUser } from "./templates/weeklysummary.template";
import { getApplicationApprovalTemplate, JobApprovalInfo } from "./templates/applicationapproval.template";

const sendMail = async (to: string, subject: string, mailTemp: () => string) => {
    const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html: mailTemp()
    });
    return info;
};

export default {

    async sendWelcomeEmail(to: string, name: string) {
        const info = await sendMail(to, "Welcome to JobMap!", () => {
            return getWelcomeEmailTemplate({ email: to, name });
        });
    },

    sendAuthCode: async (param: { to: string; otp: number, expirationMinutes: number }) => {

        const info = await sendMail(param.to, "Your Authentication Code", () => {
            return getAuthCodeTemplate({ email: param.to, otp: param.otp, expirationMinutes: param.expirationMinutes });
        });
    },

    async sendPasswordResetCode(param: { to: string; otp: number, expirationMinutes: number }) {
        const info = await sendMail(param.to, "Your Password Reset Code", () => {
            return getPasswordResetTemplate({ email: param.to, code: param.otp, expirationMinutes: param.expirationMinutes });
        });
    },

    async sendWeeklySummaryReport(param: { to: JobUser; summary: JobInfo[] }) {
        const info = await sendMail(param.to.email, "Your Weekly Summary Report", () => {
            return getWeeklySummaryTemplate({ user: param.to, jobs: param.summary });
        });
    },

    async sendApprovalEMail(param: JobApprovalInfo) {
        const info = await sendMail(param.email, "Job Application Approval Email", () => {
            return getApplicationApprovalTemplate(param)
        });
    }

}