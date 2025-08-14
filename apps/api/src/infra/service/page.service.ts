import {CreatePage} from "@entity/page.entity";

export const defaultPages: CreatePage[] = [
    {
        name: 'Home',
        slug: 'home',
        description: 'Default home page',
    },
    {
        name: 'Not Found',
        slug: 'not-found',
        description: 'Default not found page',
    }
]