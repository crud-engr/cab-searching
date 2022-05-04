import CabController from '../controllers/cab.controllers';
import { Router } from 'express';
import CabValidation from '../validations/cab.validations';
const router = Router();

router
  .route('/cabs-within')
  .get(
    [new CabValidation().validateCabsWithin],
    new CabController().getCabsWithin
  );

export default router;
