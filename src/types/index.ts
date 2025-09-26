import { Application, Job, OTP_PURPOSE, Profile, ROLE, Social } from "../../generated/prisma";

export type refreshToken = {
    userId: string,
    email: string,
    token: string,
    expires: string
}

export type User = {
    id: string;
    name?: string;
    email: string;
    password: string;
    otpHash?: string;
    otpPurpose?: OTP_PURPOSE;
    otpExpiresAt?: Date;
    otpUsed: boolean;
    isVerified: boolean;
    role: ROLE;
    jobs: Job[];
    applications: Application[];
    profiles: Profile[];
    socials: Social[];
}