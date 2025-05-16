import {ReactNode} from 'react';
import '@styles/backoffice.css';
import SidebarLayout from "@/components/backoffice/sidebar/sidebar-layout";

export default function Layout({children}: Readonly<{ children: ReactNode }>) {
    return (
        <html>
        <body>
        <SidebarLayout>
            {children}
        </SidebarLayout>
        </body>
        </html>
    );
}