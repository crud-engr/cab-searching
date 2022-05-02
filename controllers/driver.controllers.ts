import { Request, Response } from 'express';
import DriverService from '../services/driver.services';

export default class DriverController {
  async createDriver(req: Request, res: Response) {
    return new DriverService().createDriver(req, res);
  }

  async activateAccount(req: Request, res: Response) {
    return new DriverService().activateAccount(req, res);
  }

  async saveDriversLocation(req: Request, res: Response) {
     return new DriverService().saveDriversLocation(req, res);
  }
}
