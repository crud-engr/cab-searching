import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import morgan from 'morgan';
import driverRoutes from './routes/driver.routes';
import indexRoutes from './routes/index.routes';
import cabRoutes from './routes/cab.routes';
import config from 'config';
import connectDB from './config/db';
require('dotenv').config();

// start express app
const app: any = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', [
    'GET',
    'POST',
    'DELETE',
    'PATCH',
  ]);
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});
app.use(morgan('dev'));
app.use(compression());
app.set('trust proxy', true);
// too many requests limit
const limiter = rateLimit({
  max: 100,
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  message:
    'We received too many requests from this IP. Please try again in next 24hrs',
});
app.use('/api', limiter);
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

// routes config
app.use('/', indexRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/cabs', cabRoutes);

const port: number = config.get('PORT');
const host: string = config.get('HOST');

//catch unhandled rejection error
if (require.main === module) {
  app.listen(port, () =>
    console.log(`server running at http://${host}:${port}`)
  );

  // connect to db
  connectDB();

} else {
  module.exports = app;
}
