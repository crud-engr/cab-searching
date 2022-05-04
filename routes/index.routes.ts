import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ status: 'success', message: 'Welcome to cab search api' });
});

router.get('/healthcheck', (req: Request, res: Response) => {
  return res.status(200).json({ status: 'OK' });
});

export default router;
