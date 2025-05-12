import {ClientModule} from "@core/client";
import {ContactForm, ContactFormAsync, ContactSettings, formMenu, formMenu2, formMenu3} from "./components";

export * from './components'

export const ClientContactModule: ClientModule = {
    name: 'contact',
    version: '1.0.0',
    components: {
        'a': [ContactForm, ContactSettings, ContactFormAsync]
    },
    servers: [ContactFormAsync],
    menu: [
        {
            group: 'basic',
            items: [formMenu, formMenu2]
        }
    ]
}