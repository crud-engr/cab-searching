import mongoose from 'mongoose';
import IDriverLocation from '../interfaces/IDriverLocation.interface';

const DriverLocationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDriverLocation>(
  'DriverLocation',
  DriverLocationSchema
);
