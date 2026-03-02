import fs from "fs";
import path from "path";
import crypto from "crypto";
import fernet from "fernet";
import dotenv from "dotenv";

dotenv.config();

const { Secret, Token } = fernet;

// === Config ===
const SALT_FILE: string = path.join(process.cwd(), "salt.bin");
const ITERATIONS: number = 200_000;

// === Load salt (or create if missing) ===
function loadOrCreateSalt(): Buffer {
  if (fs.existsSync(SALT_FILE)) {
    return fs.readFileSync(SALT_FILE);
  }

  const salt: Buffer = crypto.randomBytes(16);
  fs.writeFileSync(SALT_FILE, salt);
  return salt;
}

// === Derive Fernet key from salt ===
export function deriveKey(): InstanceType<typeof Secret> {
  if (!process.env.MASTER_PASSWORD) {
    throw new Error("MASTER_PASSWORD not set in environment variables");
  }

  const salt = loadOrCreateSalt();

  const rawKey: Buffer = crypto.pbkdf2Sync(
    process.env.MASTER_PASSWORD,
    salt,
    ITERATIONS,
    32,
    "sha256"
  );

  const key: string = rawKey
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return new Secret(key);
}

// === Decrypt function ===
export function decryptPass(
  tokenBuffer: Buffer,
  secret: InstanceType<typeof Secret>
): string {
  const tokenBase64: string = tokenBuffer.toString("utf-8");

  const token = new Token({
    token: tokenBase64,
    secret,
  });

  return token.decode();
}