import { constants } from 'buffer';
import { Request, Response } from 'express';
import DriverLocation from '../models/DriverLocation.models';

export default class CabService {
  async getCabsWithin(req: Request, res: Response) {
    try {
      // distance can also come in dynamically by the passenger or user
      const distance = 4;
      // get passenger coordinate
      const { latitude, longitude } = req.body;
      if (!latitude || !longitude) {
        return res.status(400).json({
          status: 'failure',
          reason: 'Please provide latitude and longitude in your request',
        });
      }
      //   raduis of the earth in kilometers is 6,371 km
      const radius = distance / 6371;
      let degree = distance / radius;
      //   using haversine formular
      let harv = Math.pow(Math.sin(degree / 2), 2);
      const driversLocation = await DriverLocation.find({
        location: {
          $geoWithin: { $center: [[longitude, latitude], harv] },
        },
      }).populate({
        path: 'user',
      });
      const newDriversLocation: any[] = [];
      driversLocation.map((el: any) => {
        let obj = {
          name: el.user.name,
          car_number: el.user.car_number,
          phone_number: el.user.phone_number,
        };
        newDriversLocation.push(obj);
      });

      if (newDriversLocation.length < 1 || newDriversLocation.length === 0) {
          return res.status(200).json({
            message: 'No cabs available!',
          });
      }
        return res.status(200).json({
          available_cabs: newDriversLocation,
        });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        status: 'failure',
        reason: 'something went wrong',
      });
    }
  }
}

