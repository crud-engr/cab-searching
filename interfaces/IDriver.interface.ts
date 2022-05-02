import { Document } from 'mongoose';

export default interface IDriver extends Document {
  name: string;
  email: string;
  phone_number: string;
  license_number: string;
  car_number: string;
  createdAt: Date;
  updatedAt: Date;
}
