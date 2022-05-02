import { Request, Response } from 'express';
import moment from 'moment';
import Verification from '../models/Verification.models';
import Driver from '../models/Driver.models';
import sendMail from '../config/mail';
import config from 'config';
import axios from 'axios';
import DriverLocation from '../models/DriverLocation.models';

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

      // send token to mail
      const mailUri: string = config.get('MAIL_URI');
      const fromEmail: string = config.get('MAIL_FROM');
      const fromName: string = config.get('MAIL_FROM_NAME');
      const key: string = config.get('SENDCHAMP_API_KEY');
      const headers = {
        Accept: 'application/json',
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      };

      // let data = {
      //   subject: 'Confirm Account',
      //   to: {
      //     email: `${driver.email}`,
      //     name: `${driver.name}`,
      //   },
      //   from: {
      //     email: fromEmail,
      //     name: fromName,
      //   },
      //   message_body: {
      //     type: 'validation',
      //     value: `Please confirm your account with this OTP: ${verificationToken}`,
      //   },
      // };

      const sdk = require('api')('@sendchamp/v1.0#1ltax11ol1xgp1ca');

      sdk['send-email'](
        {
          to: [
            {
              email: 'abeebayinla@gmail.com',
              name: 'Abeeb Ayinla',
            },
          ],
          from: {
            email: 'career@chekkit.io',
            name: 'chekkit',
          },
          message_body: {
            type: 'text/html',
            value: 'Please confirm your account with this OTP: 1996',
          },
          subject: 'Verifiy Account',
        },
        {
          Authorization:
            'Bearer sendchamp_live_$2y$10$PYkBF0brwp4b5Y7zjiJDruaxTBav9Obq2/DU18MVViXFRy63aHfhO',
        }
      )
        .then((res: any) => console.log(res))
        .catch((err: any) => console.error(err));

      // const sentMail = await sendMail(
      //   'Confirm Account',
      //   {
      //     `${driver.email}`, `${driver.name}`
      //   },
      //   `Please confirm your account with this OTP: ${verificationToken}`
      // );

      return res.status(201).json({
        status: 'success',
        message: 'Please check your email and verify your account',
        data: {
          id: driver._id,
          name: driver.name,
          email: driver.email,
          phone_number: driver.phone_number,
          license_number: driver.license_number,
          car_number: driver.car_number,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: 'failure',
        reason: `something went wrong`,
      });
    }
  }

  async activateAccount(req: Request, res: Response) {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({
          status: 'failure',
          reason: 'Token is required!',
        });
      }
      // check if token still valid and not expired.
    } catch (err) {}
  }

  async saveDriversLocation(req: Request, res: Response) {
    try {
      // get driver's id
      const { id } = req.params;
      // grab values from the request body
      const { latitude, longitude } = req.body;
      const driver = await Driver.findOne({ id }).exec();
      if (!driver) {
        return res.status(400).json({
          status: 'failure',
          reason: 'driver not found',
        });
      }
      // save location
      await DriverLocation.create({ latitude, longitude });
      return res.status(200).json({
        status: 'success',
      });
    } catch (err) {
      return res.status(500).json({
        status: 'failure',
        reason: 'something went wrong.',
      });
    }
  }
}
