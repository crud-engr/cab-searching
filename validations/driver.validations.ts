import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export default class DriverValidation {
  async validateRegister(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      name: Joi.string().required().messages({
        'string.required': 'driver name is required',
        'string.empty': 'driver name should not be empty',
      }),
      email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: false } })
        .trim()
        .messages({
          'string.required': 'driver email is required',
          'string.empty': 'driver email cannot be empty',
          'string.email': 'driver email must be a valid email',
        }),
      phone_number: Joi.string().min(11).max(11).required().messages({
        'string.required': 'driver phone is required',
        'string.empty': 'driver phone cannot be empty',
        'string.min': `driver phone number cannot be less than {#limit}`,
        'string.max': `driver phone number cannot be more than {#limit}`,
      }),
      license_number: Joi.string().required().messages({
        'string.required': 'license number is required',
        'string.empty': 'license number should not be empty',
      }),
      car_number: Joi.string().required().messages({
        'string.required': 'car number is required',
        'string.empty': 'car number should not be empty',
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

  async validateDriverLocation(req: Request, res: Response, next: NextFunction) {
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
