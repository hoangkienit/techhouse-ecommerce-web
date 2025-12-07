import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

type SchemaOrBuilder = Joi.ObjectSchema | (() => Joi.ObjectSchema);

export const validate = (schemaOrBuilder: SchemaOrBuilder) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const schema = typeof schemaOrBuilder === 'function'
            ? (schemaOrBuilder as () => Joi.ObjectSchema)()
            : schemaOrBuilder;

        if (!schema || typeof schema.validate !== 'function') {
            console.error('validate middleware received invalid schema');
            res.status(500).json({ message: 'Validation schema error' });
        }

        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map((detail) => detail.message)[0];
            res.status(400).json({ errors });
            return;
        }

        next();
    };
};
