export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

// utils/Response.ts
export class Forbidden {
  message: string;
  constructor({ message }: { message: string }) {
    this.message = message;
  }

  send(res: any) {
    res.status(403).json({ message: this.message });
  }
}
