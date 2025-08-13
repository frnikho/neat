export interface S3ExceptionShape {
	message: string;
	details?: Record<string, unknown>;
}

export class S3Exception extends Error implements S3ExceptionShape {
	message: string;
	details?: Record<string, unknown>;

	constructor(message: string, details?: Record<string, unknown>) {
		super(message);
		this.message = message;
		this.details = details;
	}
}
