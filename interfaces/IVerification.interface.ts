import { Document } from 'mongoose';

export default interface IVerification extends Document {
  user: string;
  token: string;
  expiry: Date;
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}