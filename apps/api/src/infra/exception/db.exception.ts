export interface DbExceptionShape {
    message: string;
    details?: Record<string, unknown>;
}

export class DbException extends Error implements DbExceptionShape {
    message: string;
    details?: Record<string, unknown>;

    constructor(message: string, details?: Record<string, unknown>) {
        super(message);
        this.message = message;
        this.details = details;
    }
}