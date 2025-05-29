import buildClient from '@neat/api-client';

export const client = buildClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');