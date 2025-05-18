import {MenuItem, ParentMenuItem} from '@core/client';
import {Button} from '@core/client/components';
import {Contact2, Phone, User2Icon} from "lucide-react";
import SettingsForm from '../pages/settings-form';

export type Props = {
    app: string;
}

export function ContactForm() {

    return (
        <div>
            <Button>{'hello'}</Button>
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
    const {ContactForm} = await import('./contact-form');
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