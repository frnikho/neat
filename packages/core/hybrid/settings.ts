export type Settings<T extends object = object> = {
    name: string;
    key: string;
    description?: string;
    value: T;
    default: T;
}