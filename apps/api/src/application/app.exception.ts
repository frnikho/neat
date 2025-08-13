export interface ErrorShape {
	message: string;
	details?: Record<string, unknown>;
	status: number;
}

export class AppException extends Error implements ErrorShape {
	status: number;
	details?: Record<string, unknown>;

	constructor(status: number, message: string, details?: Record<string, unknown>) {
		super(message);
		this.status = status;
		this.details = details;
	}

	toJSON(): ErrorShape {
		return {
			status: this.status,
			message: this.message,
			...(this.details ? { details: this.details } : {}),
		};
	}
}

export const appException = (status: number, message: string, details?: Record<string, unknown>) => {
	return new AppException(status, message, details);
};
