import {ReactNode} from 'react';
import '@styles/backoffice.css'
import Provider from "@/app/auth/provider";

export default function Layout({children}: Readonly<{ children: ReactNode }>) {
    return (
        <html>
        <body>
            <Provider>
                {children}
            </Provider>
        </body>
        </html>
    );
}