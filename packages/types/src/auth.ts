import * as v from "valibot";

type LoginSchemaTranslation = {
    email: {
        required: string;
        invalid: string;
    }
    password: {
        minLength: string;
        uppercase: string;
        lowercase: string;
        number: string;
        special: string;
    };
}

export type LoginSchema = {
    email: string;
    password: string;
}

export const loginSchema = (translation?: LoginSchemaTranslation) => v.object({
    email: v.pipe(
        v.string(),
        v.nonEmpty(translation?.email.required || 'L\'adresse e-mail est requise'),
        v.email(translation?.email.invalid || 'L\'adresse e-mail est invalide'),
    ),
    password: v.pipe(
        v.string(),
        v.nonEmpty('Le mot de passe est requis'),
        v.minLength(8, translation?.password.minLength || 'Password must be at least 8 characters long'),
        v.regex(/[A-Z]/, translation?.password.uppercase || 'Le mot de passe doit contenir au moins une lettre majuscule'),
        v.regex(/[a-z]/, translation?.password.lowercase || 'Le mot de passe doit contenir au moins une lettre minuscule'),
        v.regex(/[0-9]/, translation?.password.number || 'Le mot de passe doit contenir au moins un chiffre'),
        v.regex(/[^A-Za-z0-9]/, translation?.password.special || 'Le mot de passe doit contenir au moins un caractère spécial')
    ),
});