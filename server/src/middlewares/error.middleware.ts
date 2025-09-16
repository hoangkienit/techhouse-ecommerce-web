import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';


interface CustomError extends Error {
    status?: number
}
const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Error: ${err.message} | URL: ${req.originalUrl} | Method: ${req.method}`);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};

export default errorHandler;    