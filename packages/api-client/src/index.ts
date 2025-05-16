import { treaty } from '@elysiajs/eden';
import type {App} from '@neat/api';

export default (url: string) => treaty<App>(url);