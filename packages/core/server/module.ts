import {Perm, NEvent} from '../hybrid';
import {AnyElysia} from "elysia";

type Module<P extends readonly Perm[], E extends readonly NEvent[]> = {
    permissions?: P
    events?: E,
    api: AnyElysia
}

export function defineModule<const P extends readonly Perm[], const E extends readonly NEvent[]>(module: Module<P, E>) {
    return module;
}