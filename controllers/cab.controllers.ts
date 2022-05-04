import { Request, Response } from 'express';
import CabService from '../services/cab.services';

export default class CabController {
  async getCabsWithin(req: Request, res: Response) {
    return new CabService().getCabsWithin(req, res);
  }
}
