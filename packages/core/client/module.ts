import {ComponentType, JSX, ReactElement, ReactNode} from "react";

const ClientComponentType = ['sidebar_header', 'sidebar_footer', 'widgets'] as const;

export type ClientComponentTypeKey = typeof ClientComponentType[number];

export type ClientModule = {
    name: string;
    version: string;
    components: {
        [key in ClientComponentTypeKey | string]: ComponentList;
    },
    servers: ServerComponent[];
    menu?: MenuGroup[];
}

// Type d'un composant React pouvant être async ou non
type MaybeAsyncComponent<P = {}> = ComponentType<P> | Awaited<ComponentType<P>>

// Liste de composants
type ComponentList<P = {}> = MaybeAsyncComponent<P>[];

type ServerComponent<P = {}> = (props: P) => ReactElement | Promise<ReactElement>;


type MenuItems = ReactNode | MenuItem | ParentMenuItem;

export type MenuGroup = {
    group?: string;
    items: MenuItems[];
}

export type ParentMenuItem = {
    name: string;
    api_name: string;
    icon?: ReactNode;
    items: MenuItem[];
    kind: 'parent_menu_item';
    page?: () => Promise<ReactNode>;
}

export type MenuItem = {
    name: string;
    api_name: string;
    icon?: JSX.Element;
    kind: 'menu_item';
    page: () => Promise<ReactNode>;
}

export const isReactElement = (item: MenuItems): item is ReactElement => {
    return (item as ReactElement).type !== undefined;
}

export const isParentMenuItem = (item: MenuItems): item is ParentMenuItem => {
    return (item as ParentMenuItem).kind === 'parent_menu_item';
}

export const isMenuItem = (item: MenuItems): item is MenuItem => {
    return (item as MenuItem).kind === 'menu_item';
}