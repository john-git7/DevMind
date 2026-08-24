import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

interface ValidationOptions {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export const validate = (options: ValidationOptions | ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if ('parseAsync' in options) {
        req.body = await options.parseAsync(req.body);
      } else {
        if (options.body) {
          req.body = await options.body.parseAsync(req.body);
        }
        if (options.query) {
          req.query = (await options.query.parseAsync(req.query)) as any;
        }
        if (options.params) {
          req.params = (await options.params.parseAsync(req.params)) as any;
        }
      }
      return next();
    } catch (error: any) {
      if (error?.name === 'ZodError' || error instanceof ZodError || Array.isArray(error?.issues)) {
        return res.status(400).json({
          error: 'Validation failed',
          issues: (error.issues || []).map((issue: any) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }
      return res.status(400).json({ error: 'Invalid request payload' });
    }
  };
};

export const validateBody = (schema: ZodSchema) => validate({ body: schema });
export const validateQuery = (schema: ZodSchema) => validate({ query: schema });
export const validateParams = (schema: ZodSchema) => validate({ params: schema });
