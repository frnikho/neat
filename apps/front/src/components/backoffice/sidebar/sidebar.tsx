import {Sidebar} from "@neat/ui";
import SidebarContentApp from './sidebar-content';
import SidebarFooterApp from "./sidebar-footer";
import SidebarHeaderApp from "./sidebar-header";

export default function SidebarApp() {

    // load data from server

    return (
        <Sidebar>
            <SidebarHeaderApp/>
            <SidebarContentApp/>
            <SidebarFooterApp/>
        </Sidebar>
    )
}