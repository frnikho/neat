import {ReactNode} from 'react';
import '@styles/backoffice.css'

export default function Layout({children}: Readonly<{ children: ReactNode }>) {
    return (
        <html>
        <body>
        {children}
        </body>
        </html>
    );
}