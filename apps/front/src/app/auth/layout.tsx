import {ReactNode} from 'react';
import '@styles/backoffice.css'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

export default function Layout({children}: Readonly<{ children: ReactNode }>) {
    return (
        <html>
        <body>
            {children}
        </body>
        </html>
    );
}