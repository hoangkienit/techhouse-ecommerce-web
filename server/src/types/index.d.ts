import 'express';
import { JwtPayload } from 'jsonwebtoken';

declare module 'express' {
    export interface Request {
        user?: JwtPayload & {
            userId: string;
            username: string;
            role: string;
        }
    }
}