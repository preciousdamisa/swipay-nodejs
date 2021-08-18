import mongoose, { Schema } from 'mongoose';
import config from 'config';
import * as Jwt from 'jsonwebtoken';
import Joi from 'joi';

import nameSchema, { Name } from './schemas/name';
import addressSchema, { Address } from './schemas/address';

interface User {
  name: Name;
  phone: string;
  email: string;
  gender: string;
  picture: { large: string; medium: string; thumbnail: string };
  password: string;
  balance: number;
  transferPin: string;
  panicPin: string;
  address: Address;
  dob: { date: Date; age: number };
}

const schema = new Schema<User>(
  {
    name: { type: nameSchema },
    phone: {
      type: String,
      required: true,
      unique: true,
      minLength: 11,
      maxLength: 11,
    },
    email: {
      type: String,
      minLength: 5,
      maxLength: 250,
      unique: true,
      required: true,
    },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    picture: { large: String, medium: String, thumbnail: String },
    password: { type: String, trim: true, required: true },
    balance: { type: Number, min: 0, max: 1000000000 },
    transferPin: { type: String, trim: true },
    panicPin: { type: String, trim: true },
    address: addressSchema,
    dob: {
      date: Date,
      age: { type: Number, min: 13 },
    },
  },
  { timestamps: true }
);

schema.methods.genAuthToken = function () {
  return Jwt.sign(
    {
      id: this._id,
      phone: this.phone,
      email: this.email,
    },
    config.get('jwtAuthPrivateKey'),
    { expiresIn: '12h' }
  );
};

export default mongoose.model('user', schema);

export interface SignupData {
  email: string;
  phone: string;
  password: string;
}

export function validateSignupData(data: SignupData) {
  const schema = Joi.object({
    phone: Joi.string()
      .trim()
      .min(11)
      .max(11)
      .regex(new RegExp('^[0-9]*$'))
      .required(),
    email: Joi.string()
      .min(5)
      .max(250)
      .email({ minDomainSegments: 2 })
      .required(),
    password: Joi.string().trim().min(6).max(50).required(),
  });

  return schema.validate(data);
}

export interface AuthData {
  email: string;
  password: string;
}

export function validateAuthData(data: AuthData) {
  const schema = Joi.object({
    email: Joi.string()
      .max(250)
      .trim()
      .email({ minDomainSegments: 2 })
      .required(),
    password: Joi.string().min(6).max(50).trim().required(),
  });

  return schema.validate(data);
}

export interface KYCData {
  firstName: string;
  lastName: string;
  bvn: string;
  accountNumber: string;
  bankCode: string;
}
export function validateKYCData(data: KYCData) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(2).max(25).required(),
    lastName: Joi.string().trim().min(2).max(25).required(),
    bvn: Joi.string().trim().min(11).max(11).required(),
    accountNumber: Joi.string().trim().min(10).max(10).required(),
    bankCode: Joi.string().trim().min(3).max(3).required(),
  });

  return schema.validate(data);
}
