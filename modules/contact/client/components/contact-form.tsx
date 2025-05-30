import {MenuItem, ParentMenuItem} from '@neat/core/client';
import {Button} from '@neat/core/client';
import {Contact2, Phone, User2Icon} from "lucide-react";
import SettingsForm from '../pages/settings-form';

import { m } from "../../locales/messages.js";

export type Props = {
    app: string;
}

export function ContactForm() {

    return (
        <div>
            <Button>{m.example_message({username: 'ContextForm'})}</Button>
        </div>
    )
}

export function ContactSettings() {
    return (
        <div>
            abc
        </div>
    )
}

export async function ContactFormAsync() {
    return <ContactForm/>;
}

export const formMenu: MenuItem = {
    name: 'Contact Form',
    api_name: 'contact_form_item',
    icon: <Contact2/>,
    kind: 'menu_item',
    page: SettingsForm
}

export const formMenuAccount: MenuItem = {
    name: 'Account',
    api_name: 'account',
    icon:  <User2Icon/>,
    kind: 'menu_item',
    page: SettingsForm
}

export const formMenu2: ParentMenuItem = {
    api_name: 'contact_form',
    icon: <Phone/>,
    name: 'Contact Form 2',
    items: [formMenuAccount],
    kind: 'parent_menu_item',
}

export function formMenu3() {
    return (
        <Button>
            Hello world !
        </Button>
    )
}