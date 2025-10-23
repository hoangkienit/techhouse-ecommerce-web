import { Socket } from "socket.io";
import { IUserPayload } from "../interfaces/jwt.interface";


export interface AuthenticatedSocket extends Socket {
  user?: IUserPayload | null;
}