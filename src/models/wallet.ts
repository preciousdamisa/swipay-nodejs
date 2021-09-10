import mongoose, { Schema } from 'mongoose';
import Joi from 'joi';

interface Wallet {
  userId: string;
  transferPin: string;
  balance: number;
}

const schema = new Schema(
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

export interface CreateWalletData {
  transferPin: string;
}

export function validateCreateWalletData(data: CreateWalletData) {
  const schema = Joi.object({
    transferPin: Joi.string().trim().min(4).max(4).required(),
  });

  return schema.validate(data);
}
