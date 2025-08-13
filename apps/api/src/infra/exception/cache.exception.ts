export interface CacheExceptionShape {
	message: string;
	details?: Record<string, unknown>;
}

export class CacheException extends Error implements CacheExceptionShape {
	message: string;
	details?: Record<string, unknown>;

	constructor(message: string, details?: Record<string, unknown>) {
		super(message);
		this.message = message;
		this.details = details;
	}
}
