'use client';

import {Sidebar} from "@neat/ui";
import SidebarContentApp from './sidebar-content';
import SidebarFooterApp from "./sidebar-footer";
import SidebarHeaderApp from "./sidebar-header";

export default function SidebarApp() {

    return (
        <Sidebar>
            <SidebarHeaderApp/>
            <SidebarContentApp/>
            <SidebarFooterApp/>
        </Sidebar>
    )
}