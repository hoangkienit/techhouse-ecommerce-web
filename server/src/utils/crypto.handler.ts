import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const HashIP = (ip: string | undefined) =>
  ip ? crypto.createHash("sha256").update(ip + (process.env.IP_SALT || "salt")).digest("hex") : undefined;

export const HashPassword = async(pw: string): Promise<string> => {
    return await bcrypt.hash(pw, 10);
}

export const VerifyPassword = async(pw: string, userPassword: string): Promise<boolean> => {
    return await bcrypt.compare(pw, userPassword);
}