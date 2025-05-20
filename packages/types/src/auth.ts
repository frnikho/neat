import * as v from "valibot";

const email =  v.pipe(
    v.string(),
    v.nonEmpty(),
    v.email(),
    v.maxLength(255),
);

const password = v.pipe(
    v.string(),
    v.nonEmpty(),
    v.minLength(8),
    v.regex(/[A-Z]/),
    v.regex(/[a-z]/),
    v.regex(/[0-9]/),
    v.regex(/[^A-Za-z0-9]/)
)

export const loginSchema = v.object({
    email,
    password,
});

export const registerSchema = v.object({
    code: v.string(),
    firstname: v.pipe(
        v.string(),
        v.minLength(2),
        v.maxLength(128),
    ),
    lastname: v.pipe(
        v.string(),
        v.minLength(2),
        v.maxLength(128),
    ),
});