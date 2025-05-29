import { Permission, NEvent, Settings } from '../hybrid';
type Module<P extends Permission[], E extends NEvent[], S extends Settings[]> = {
    name: string;
    api_name: string;
    version: string;
    description?: string;
    author?: string[] | string;
    repo?: string;
    schema?: string;
    permissions?: P;
    events?: E;
    settings?: S;
};
export declare function defineModule<const P extends Permission[], const E extends NEvent[], const S extends Settings[]>(module: Module<P, E, S>): Module<P, E, S>;
export {};
