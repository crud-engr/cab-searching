import { Document } from 'mongoose';

export default interface IDriverLocation extends Document {
  user: string;
  latitude: Number;
  longitude: Number;
  createdAt: Date;
  updatedAt: Date;
}
