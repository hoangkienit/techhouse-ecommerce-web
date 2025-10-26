import crypto from 'crypto';

export const HashIP = (ip: string | undefined) =>
  ip ? crypto.createHash("sha256").update(ip + (process.env.IP_SALT || "salt")).digest("hex") : undefined;