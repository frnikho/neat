export interface JwtExceptionShape {
    message: string;
    details?: Record<string, unknown>;
}

export class JwtException extends Error implements JwtExceptionShape {
    message: string;
    details?: Record<string, unknown>;

    constructor(message: string, details?: Record<string, unknown>) {
        super(message);
        this.message = message;
        this.details = details;
    }
}