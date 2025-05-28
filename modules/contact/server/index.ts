import Elysia, {t} from "elysia";
import * as path from "node:path";
import { fileURLToPath } from 'url';
export * from './schema';
import {defineModule} from "@neat/core/server";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const MODULE_FOLDER = path.join(__dirname, '../migrations')

export default defineModule({
    name: 'Contact',
    api_name: 'contact',
    version: '1.0.0',
    events: [{object: 'contact', action: 'create', name: 'contact.create'}],
    schema: MODULE_FOLDER,
    permissions: [{
        name: 'Create a contact form',
        resource: 'contact',
        action: 'create',
    }],
    settings: [{
        name: 'role',
        key: 'abc',
        value: {

        },
        default: {

        }
    }],

})

export const api = new Elysia()
    .get("/contact", () => "Hello from Contact Form")
    .model({
        'abc': t.Object({
            'name': t.String(),
            'email': t.String(),
            'message': t.String()
        })
    });