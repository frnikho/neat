export const defaultSettings = [
    {
        name: 's3',
        description: 'Manage s3 settings (bucket, region...)',
        key: 's3',
        value: {
            user: {
                name: 'user',
                endpoint: 'http://localhost:9000/user',
            },
        },
    },
    {
        name: 'Company Settings',
        description: 'Manage company information',
        key: 'company',
        value: {
            title: 'My Application',
            description: 'This is a sample application.',
            slogan: 'Empowering Your Business',
            logoUrl: 'https://example.com/logo.png',
            version: '1.0.0',
        }
    }
] as const;

type DefaultSettings = (typeof defaultSettings)[number]; // Union des éléments

export type SettingsKey = DefaultSettings['key'];
export type SettingsValue<K extends SettingsKey> = Extract<
    DefaultSettings,
    { key: K }
>['value'];