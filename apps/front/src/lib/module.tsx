import { modules } from "$app"
import {isMenuItem, isParentMenuItem, isReactElement} from "@core/client";
import {ReactNode} from "react";
import SettingsMenuItem from "@/lib/module/menu-item";
import SettingsParentMenuItem from "@/lib/module/parent-menu-item";

export const getAllGroups = () =>
    modules.flatMap(module => module.menu?.map(menu => menu.group) ?? []).filter(Boolean);

export const getAllMenu = () =>
    modules.flatMap(module =>
        module.menu?.flatMap(menu =>
            menu.items.map(item => {
                if (isReactElement(item)) {
                    return item
                };
                if (isParentMenuItem(item)) {
                    return <SettingsParentMenuItem key={item.api_name} item={item} />;
                }
                if (isMenuItem(item)) {
                    return <SettingsMenuItem key={item.api_name} item={item} />;
                }
            }).filter(Boolean)
        ) ?? []
    );

export const getMenuPage = (api_name: string, api_parent?: string): (() => Promise<ReactNode>) | null => {
    for (const module of modules) {
        for (const menu of module.menu ?? []) {
            for (const item of menu.items) {
                if (isMenuItem(item) && item.api_name === api_name) {
                    return item.page;
                } else if (isParentMenuItem(item) && item.api_name === api_parent) {
                    const subItem = item.items.find(sub => isMenuItem(sub) && sub.api_name === api_name);
                    if (subItem) {
                        return subItem.page;
                    }
                }
            }
        }
    }
    return null;
}