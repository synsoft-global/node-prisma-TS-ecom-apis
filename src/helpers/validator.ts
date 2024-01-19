import Joi from "@hapi/joi";
import { Request, Response, NextFunction } from "express";

export enum ValidationSource {
  BODY = "body",
  HEADER = "headers",
  QUERY = "query",
  PARAM = "params",
}

export const JoiAuthBearer = () =>
  Joi.string().custom((value: string, helpers: any) => {
    return value;
  }, "Authorization Header Validation");

const validateInput = (
  schema: Joi.ObjectSchema,
  source: ValidationSource,
  data: any
) => {
  const { error } = schema.validate(data);
  return error;
};

export default (
  schema: Joi.ObjectSchema,
  source: ValidationSource = ValidationSource.BODY
) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const error = validateInput(schema, source, req[source]);

      if (!error) {
        return next();
      }

      const { details } = error;
      const message = details
        .map((i) => i.message.replace(/['"]+/g, ""))
        .join(",");
      console.error(message);

      return res.status(400).json({ error: message });
    } catch (error) {
      console.error(error);
      next(new Error("Internal Server Error"));
    }
  };
