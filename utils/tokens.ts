// utils/tokens.ts
import crypto from "crypto";

export function generateAccessToken() {
  return crypto.randomBytes(32).toString("hex");
}
