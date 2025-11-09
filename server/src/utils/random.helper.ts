import { nanoid, customAlphabet } from "nanoid";

export const generateOrderCode = () => {
  const randomNumber = Math.floor(10000000 + Math.random() * 90000000); // 7-digit random number
  return `DH${randomNumber}`;
}

export const generatePassword = (): string => {
    return nanoid(15).toLowerCase();
}

export const generateRandomID = (num: number): string => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
  // Create generator for 6-letter segments
  const nanoid = customAlphabet(alphabet, 6);

  // Generate 3 parts and join with "-"
  const part1 = nanoid();
  const part2 = nanoid();
  const part3 = nanoid();

  return `${part1}-${part2}-${part3}`;
}
