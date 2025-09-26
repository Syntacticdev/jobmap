import crypto from "crypto"

export function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

export function hashOtp(otp: string) {
    return crypto.createHash("sha256").update(otp).digest("hex");
}