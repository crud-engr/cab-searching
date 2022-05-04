import mongoose from 'mongoose';
import IVerification from '../interfaces/IVerification.interface';
import crypto from 'crypto';
import moment from 'moment';

const VerificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiry: {
      type: Date,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

VerificationSchema.pre<IVerification>('save', function (next:any) {
  this.token = crypto.createHash('sha256').update(this.token).digest('hex');
  this.expiry = moment().add(5, 'minutes').toDate()
  next();
});

export default mongoose.model<IVerification>(
  'Verification',
  VerificationSchema
);
