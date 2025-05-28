import { treaty } from '@elysiajs/eden';
import type {App} from '@neat/api';

export const createClient = (url: string) => treaty<App>(url);

export type Client = App;

export default createClient;
