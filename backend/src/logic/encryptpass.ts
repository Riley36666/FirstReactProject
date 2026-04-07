import fernet from "fernet";

const { Token } = fernet;

export function encryptPass(
  plainText: string,
  secret: InstanceType<typeof fernet.Secret>
): Buffer {
  const token = new Token({
    secret,
    time: Date.now(),
  });

  const encrypted = token.encode(plainText);

  return Buffer.from(encrypted, "utf-8");
}