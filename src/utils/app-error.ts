import { HTTPSTATUS, HttpStatusCodeType } from "../config/http.config"

export class AppError extends Error {
    public statusCode: HttpStatusCodeType;
    constructor(message: string, statusCode: HttpStatusCodeType) {
        super(message);
        this.statusCode = statusCode;
    }
}
export class UnAuthorizedException extends AppError {
    constructor(message = "Unauthorized Access") {
        super(message, HTTPSTATUS.UNAUTHORIZED)
    }
}
export class NotFoundException extends AppError {
    constructor(message = "Resource Not Found") {
        super(message, HTTPSTATUS.NOT_FOUND)
    }
}

export class InternalServerException extends AppError {
    constructor(message = "Internal Server Error") {
        super(message, HTTPSTATUS.INTERNAL_SERVER_ERROR)
    }
}
export class BadRequestException extends AppError {
    constructor(message = "Bad Request") {
        super(message, HTTPSTATUS.BAD_REQUEST)
    }
}