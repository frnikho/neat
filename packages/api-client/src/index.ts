import {treaty} from '@elysiajs/eden'
import type {App} from '@neat/api';

export const buildClient = (url: string) => treaty<App>(url);
