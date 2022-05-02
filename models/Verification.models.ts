import mongoose from 'mongoose';
import IVerification from '../interfaces/IVerification.interface';

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
        required: true
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

export default mongoose.model<IVerification>(
  'Verification',
  VerificationSchema
);
