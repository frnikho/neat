import type { ReactNode } from 'react'
import {
    Outlet,
    createRootRoute,
} from '@tanstack/react-router'
import {Scripts} from "@tanstack/react-start";

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
        ],
    }),
    component: RootComponent,
})

function RootComponent() {
    return (
        <RootDocument>
            <Outlet />
        </RootDocument>
    )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html>
        {children}
        <Scripts/>
        </html>
    )
}