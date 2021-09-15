import mongoose, { Schema } from 'mongoose';
import Joi from 'joi';

interface Wallet {
  userId: string;
  transferPin: string;
  balance: number;
}

const schema = new Schema<Wallet>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, unique: true },
    transferPin: {
      type: String,
      trim: true,
      required: true,
    },
    balance: { type: Number, min: 0.0, max: 1000000.0, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('wallet', schema);

export interface CreateWalletReq {
  transferPin: string;
}

export function validateCreateWalletReq(data: CreateWalletReq) {
  const schema = Joi.object({
    transferPin: Joi.string().trim().min(4).max(4).required(),
  });

  return schema.validate(data);
}
