'use client';

import {ReactNode} from "react";
import { Toaster } from "@neat/ui"

export default function Provider({children}: Readonly<{ children: ReactNode }>) {
    return (
        <div>
            <Toaster/>
            <main>{children}</main>
        </div>
    )
}