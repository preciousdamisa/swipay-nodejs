import mongoose, { Schema } from 'mongoose';
import Joi from 'joi';

interface Transaction {
  senderId: string;
  receiverId: string;
  amount: number;
  description: string;
  category: string;
}

const schema = new Schema<Transaction>(
  {
    senderId: { type: Schema.Types.ObjectId, required: true },
    receiverId: { type: Schema.Types.ObjectId, required: true },
    amount: { type: Number, min: 1.0, max: 1000000.0, required: true },
    description: { type: String, trim: true, minLength: 5, maxLength: 250 },
    category: {
      type: String,
      trim: true,
      enum: ['Airtime', 'Transportation', 'School Fee', 'Other'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', schema);

export interface StartTransactionReq {
  receiverPhone: string;
}

export function validateStartTransactionReq(reqBody: StartTransactionReq) {
  return Joi.object({
    receiverPhone: Joi.string().trim().min(11).max(11).required(),
  }).validate(reqBody);
}

export interface FinishTransactionReq {
  receiverPhone: string;
  amount: number;
  transferPin: string;
}

export function validateFinishTransactionReq(reqBody: FinishTransactionReq) {
  const schema = Joi.object({
    receiverPhone: Joi.string().trim().min(11).max(11).required(),
    amount: Joi.number().min(1.0).max(10000).required(),
    transferPin: Joi.string().trim().min(4).max(4).required(),
  });

  return schema.validate(reqBody);
}
