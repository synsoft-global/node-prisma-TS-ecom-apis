import Joi from "@hapi/joi";
import { JoiAuthBearer } from "../helpers/validator";

export default {
  userCredential: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
  auth: Joi.object()
    .keys({
      authorization: JoiAuthBearer().required(),
    })
    .unknown(true),
  signup: Joi.object().keys({
    name: Joi.string().required().min(3),
    email: Joi.string().required().email(),
    dob: Joi.date().iso().required(),
  }),
  activation: Joi.object().keys({
    password: Joi.string().required().min(6),
  }),
  resetPassword: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
  updatePassword: Joi.object().keys({
    password: Joi.string().required().min(6),
  }),
  apiKey: Joi.object()
    .keys({
      "x-api-key": Joi.string().required(),
    })
    .unknown(true),
};
