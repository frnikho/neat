import {JWTPayload} from "jose";

export type Token = {
  sessionId: string;
  userId: string;
} & JWTPayload