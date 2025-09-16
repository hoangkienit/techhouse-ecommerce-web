import { Response } from "express";

import reason from "./reason";
import statusCode from "./statusCode";

interface ISuccessResponse {
    message: string;
    status?: number;
    success?: boolean;
    data?: object;
}

interface ISuccessResponseWithData extends ISuccessResponse {

    data: object;
}


class SuccessResponse {
    success: boolean;
    message: string;
    status: number;
    data: object;

    constructor({ message, status = statusCode.OK, success = true, data = {} }: ISuccessResponse) {
        this.success = success;
        this.message = !message ? reason.OK : message;
        this.status = status;
        this.data = data;
            
    }

    send(res: Response, header = {}): Response {
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({ message, data }: ISuccessResponseWithData) {
        super({message, data})
    }
}

class CREATED extends SuccessResponse {
    constructor({ message, status = statusCode.CREATED, data }: ISuccessResponseWithData) {
        super({message, status, data})
    }
}

export {
    OK,
    CREATED
}