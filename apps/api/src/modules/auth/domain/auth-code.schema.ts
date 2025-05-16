import {Static, t} from "elysia";

export const authCode = t.Object({
  id: t.String(),
  code: t.String(),
  created_at: t.Date(),
  expires_at: t.Optional(t.Date()),
});

export type AuthCode = Static<typeof authCode>;

export type CreateAuthCode = {
  code: string;
  expires_at?: Date;
}