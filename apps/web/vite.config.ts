import tailwindcss from "@tailwindcss/vite";
import {tanstackStart} from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import {defineConfig} from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { generateSitemap } from "tanstack-router-sitemap";
import {sitemap} from "./src/sitemap";

export default defineConfig({
    server: {
        port: 3000,
    },
    plugins: [
        tsConfigPaths(),
        tanstackStart({customViteReactPlugin: true, target: "bun"}),
        generateSitemap(sitemap),
        tailwindcss(),
        viteReact()
    ],
});
