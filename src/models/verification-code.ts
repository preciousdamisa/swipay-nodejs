import mongoose, { Schema } from 'mongoose';
import Joi from 'joi';

const schema = new Schema({
  phone: {
    type: String,
    minLength: 11,
    maxLength: 11,
    unique: true,
    required: true,
  },
  code: {
    type: String,
    trim: true,
    minLength: 6,
    maxLength: 6,
    unique: true,
    required: true,
  },
});

export default mongoose.model('Verification-Code', schema);

export function validatePhone(data: { phone: string }) {
  return Joi.object({
    phone: Joi.string()
      .trim()
      .min(11)
      .max(11)
      .regex(new RegExp('^[0-9]*$'))
      .required(),
  }).validate(data);
}
