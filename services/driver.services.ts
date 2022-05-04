import { Request, Response } from 'express';
import moment from 'moment';
import crypto from 'crypto';
import Verification from '../models/Verification.models';
import Driver from '../models/Driver.models';
import DriverLocation from '../models/DriverLocation.models';
import { sendEmail } from '../config/mail';

export default class DriverService {
  generateToken() {
    return `${Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)}`;
  }

  async createDriver(req: Request, res: Response) {
    try {
      // grab values from the request body
      let { name, email, license_number, phone_number, car_number } = req.body;
      const emailExists = await Driver.findOne({
        email,
      }).exec();
      const phoneExists = await Driver.findOne({
        phone_number,
      }).exec();
      const licenseExists = await Driver.findOne({
        license_number,
      }).exec();
      const carExists = await Driver.findOne({
        car_number,
      }).exec();
      if (emailExists) {
        return res.status(400).json({
          status: 'failure',
          reason: 'Driver email already exists',
        });
      }
      if (phoneExists) {
        return res.status(400).json({
          status: 'failure',
          reason: 'Driver phone already exists',
        });
      }
      if (licenseExists) {
        return res.status(400).json({
          status: 'failure',
          reason: 'license number already exists',
        });
      }
      if (carExists) {
        return res.status(400).json({
          status: 'failure',
          reason: 'car number already exists',
        });
      }
      const input = {
        name,
        email,
        phone_number,
        license_number,
        car_number,
      };
      const driver = await Driver.create(input);
      let verificationToken = this.generateToken();
      await Verification.create({
        user: driver._id,
        token: verificationToken,
        expiry: moment().add(5, 'minutes'),
      });

      const message = `Hi ${driver.name.split(' ')[0]}.
      Welcome to Chekkit. We are happy to have you here.
      Please use the below code to activate your account.
      ${verificationToken}`;

      // send token to mail
      await sendEmail({
        email: driver.email,
        subject: 'Activate Your Account',
        message,
      });

      return res.status(201).json({
        id: driver._id,
        name: driver.name,
        email: driver.email,
        phone_number: driver.phone_number,
        license_number: driver.license_number,
        car_number: driver.car_number,
      });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        status: 'failure',
        reason: `something went wrong`,
      });
    }
  }

  async activateAccount(req: Request, res: Response) {
    try {
      const { token } = req.body;
      const { id } = req.params;
      const driver = await Driver.findOne({ _id: id }).exec();
      if (!driver) {
        return res.status(404).json({
          status: 'failure',
          reason: 'Driver not found!',
        });
      }
      if (!token) {
        return res.status(400).json({
          status: 'failure',
          reason: 'Token is required!',
        });
      }
      // check if token still valid and not expired.
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      const verify = await Verification.findOne({
        user: driver._id,
        token: hashedToken,
        expiry: { $gt: moment().format() },
        isVerified: false,
      }).exec();

      if (!verify || verify === null) {
        return res.status(404).json({
          status: 'failure',
          reason: 'Invalid or expired token!',
        });
      }

      // if token not expired
      await Driver.findOneAndUpdate(
        {
          _id: id,
          isVerified: false,
        },
        {
          _id: id,
          isVerified: true,
        }
      );

      await Verification.findOneAndUpdate(
        {
          user: verify.user,
          expiry: { $gt: moment().format() },
          isUsed: false,
        },
        {
          user: verify.user,
          isUsed: true,
        }
      );
      return res.status(200).json({
        message: 'Account verified',
      });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        status: 'failure',
        reason: `something went wrong`,
      });
    }
  }

  async saveDriversLocation(req: Request, res: Response) {
    try {
      // get driver's id
      const { id } = req.params;
      // grab values from the request body
      const { latitude, longitude } = req.body;
      const driver = await Driver.findOne({ id }).exec();
      if (!driver) {
        return res.status(404).json({
          status: 'failure',
          reason: 'Driver not found',
        });
      }
      // save location
      await DriverLocation.create({ user: id, latitude, longitude });
      return res.status(201).json({
        status: 'success',
      });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        status: 'failure',
        reason: 'something went wrong.',
      });
    }
  }
}
