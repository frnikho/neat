import {Perm, NEvent} from '../hybrid';
import {AnyElysia} from "elysia";

type Module<P extends Perm[], E extends NEvent[]> = {
    name: string,
    api_name: string,
    version: string,
    description?: string,
    author?: string[] | string,
    repo?: string,
    permissions: P
    events?: E,
    api: AnyElysia
}

export function defineModule<const P extends Perm[], const E extends NEvent[]>(module: Module<P, E>) {
    return module;
}