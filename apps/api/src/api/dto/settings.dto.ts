import {t} from 'elysia';

export const settings = t.Object({
    id: t.String(),
    name: t.String({maxLength: 256}),
    description: t.Optional(t.String({maxLength: 4096})),
});

export const settingsKey = t.Object({
    key: t.Enum({
        s3: 's3',
    })
});

export const updateSettings = t.Object({
    name: t.Optional(t.String({maxLength: 256})),
    description: t.Optional(t.String({maxLength: 4096})),
});

export const settingsModels = {
    'settings.key': settingsKey,
    'settings.update': updateSettings,
}