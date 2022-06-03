import Joi from '@hapi/joi';
import { JoiAuthBearer } from '../helpers/validator';

/**
  * This function validates the api input
  */
export default {
  apiKey: Joi.object()
    .keys({
      'x-api-key': Joi.string().required(),
    })
    .unknown(true),
  auth: Joi.object()
    .keys({
      authorization: JoiAuthBearer().required(),
    })
    .unknown(true),
};
