import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schemaBuilder: () => Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const schema = schemaBuilder();
        console.log(req.body);
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map((detail) => detail.message)[0];
            res.status(400).json({ errors });
            return;
        }

        next();
    };
};