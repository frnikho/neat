import {ClientModule} from "@neat/core/client";
import {ContactForm, ContactFormAsync, ContactSettings, formMenu, formMenu2} from "./components";

export const ClientContactModule: ClientModule = {
    name: 'contact',
    version: '1.0.0',
    components: {
        'a': [ContactForm, ContactSettings, ContactFormAsync]
    },
    servers: [],
    menu: [
        {
            group: 'basic',
            items: [formMenu, formMenu2]
        }
    ]
}

export * from './components'