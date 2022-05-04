import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export default class CabValidation {
  async validateCabsWithin(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      latitude: Joi.number().required().messages({
        'number.required': 'latitude is required',
        'number.empty': 'latitude should not be empty',
      }),

      longitude: Joi.number().required().messages({
        'number.required': 'longitude is required',
        'number.empty': 'longitude cannot be empty',
      }),
    }).options({ abortEarly: true });

    try {
      const value = await schema.validateAsync(req.body);
      next();
    } catch (err) {
      let errMessage = err.details[0].message.split(' ');
      let [field, ...others] = errMessage;
      field = field.replace(/['"]+/g, '');
      let newErrorMessage = `${field} ${others.join(' ')}`;
      return res.status(422).json({
        status: 'failure',
        reason: newErrorMessage,
      });
    }
  }
}
