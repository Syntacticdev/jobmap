export interface auth_code {
    userId: string;
    code: number
}

interface payload {
    title?: string;
    body?: string;
}

export interface notification {
    userId: string;
    payload: payload;
}

export interface email_service {
    sendAuthCode: (param: { to: string; otp: number }) => Promise<void>;
    sendPasswordResetCode: (param: { to: string; code: number }) => Promise<void>;
    registration_successful: (param: { to: string }) => Promise<void>;
}
