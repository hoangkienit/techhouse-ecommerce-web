import reason from './reason';
import statusCode from './statusCode';

class ErrorResponse extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message)
        this.status = status;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = reason.BAD_REQUEST, status = statusCode.BAD_REQUEST) {
        super(message, status);
    }
}

class UnauthorizedError extends ErrorResponse {
    constructor(message = reason.UNAUTHORIZED, status = statusCode.UNAUTHORIZED) {
        super(message, status);
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(message = reason.FORBIDDEN, status = statusCode.FORBIDDEN) {
        super(message, status);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = reason.NOT_FOUND, status = statusCode.NOT_FOUND) {
        super(message, status);
    }
}

class ConflictError extends ErrorResponse {
    constructor(message = reason.CONFLICT, status = statusCode.CONFLICT) {
        super(message, status);

    }
}

class InternalServerError extends ErrorResponse {
    constructor(message = reason.INTERNAL_SERVER_ERROR, status = statusCode.INTERNAL_SERVER_ERROR) {
        super(message, status);
    }
}

export {
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    InternalServerError
};
