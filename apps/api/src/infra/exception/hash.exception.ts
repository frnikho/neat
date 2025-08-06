interface ExceptionShape {
    message: string;
    details?: Record<string, unknown>;
}

export class HashException extends Error implements ExceptionShape {
    message: string;
    details?: Record<string, unknown>;

    constructor(message: string, details?: Record<string, unknown>) {
        super(message);
        this.message = message;
        this.details = details;
    }
}