import mongoose from 'mongoose';
import IDriver from '../interfaces/IDriver.interface';

const DriverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true
    },
    phone_number: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    license_number: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true
    },
    car_number: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDriver>('Driver', DriverSchema);
