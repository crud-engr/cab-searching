import DriverController from '../controllers/driver.controllers';
import { Router } from 'express';
import DriverValidation from '../validations/driver.validations';
const router = Router();

router
  .route('/register')
  .post(
    [new DriverValidation().validateRegister],
    new DriverController().createDriver
  );

router
  .route('/:id/activate-account')
  .post(
    [new DriverValidation().validateActivateAccount],
    new DriverController().activateAccount
  );

router
  .route('/:id/locations')
  .post(
    [new DriverValidation().validateDriverLocation],
    new DriverController().saveDriversLocation
  );

export default router;
