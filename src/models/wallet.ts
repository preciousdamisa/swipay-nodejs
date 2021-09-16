import mongoose, { Schema } from 'mongoose';
import Joi from 'joi';

interface Wallet {
  userId: string;
  transferPin: string;
  balance: number;
}

const schema = new Schema<Wallet>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'User',
    },
    transferPin: {
      type: String,
      trim: true,
      required: true,
    },
    balance: { type: Number, min: 0.0, max: 1000000.0, required: true },
    phone: {
      type: String,
      trim: true,
      minLength: 11,
      maxLength: 11,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Wallet', schema);

export interface CreateWalletReq {
  transferPin: string;
}

export function validateCreateWalletReq(reqBody: CreateWalletReq) {
  return Joi.object({
    transferPin: Joi.string().trim().min(4).max(4).required(),
  }).validate(reqBody);
}

export interface GetOwnerReq {
  walletPhone: string;
}

export function validateGetOwnerReq(reqBody: GetOwnerReq) {
  return Joi.object({
    walletPhone: Joi.string().trim().min(11).max(11).required(),
  }).validate(reqBody);
}
