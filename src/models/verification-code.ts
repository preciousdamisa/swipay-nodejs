import mongoose, { Schema } from 'mongoose';
import { Response } from 'express';
import Joi from 'joi';

import { SendCodeRes } from '../services/user';

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

export function validateCode(data: { phone: string; code: string }) {
  return Joi.object({
    phone: Joi.string()
      .trim()
      .min(11)
      .max(11)
      .regex(new RegExp('^[0-9]*$'))
      .required(),
    code: Joi.string().trim().min(6).max(6).required(),
  }).validate(data);
}

export function sendResponse(sendCodeRes: SendCodeRes, res: Response) {
  if (sendCodeRes.status === 1) {
    res.status(500).send({ message: sendCodeRes.message });
  } else {
    res.status(201).send({ message: sendCodeRes.message });
  }
}
