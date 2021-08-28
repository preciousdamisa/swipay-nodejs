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
  address: Address;
  dob: { date: Date };
  referrer: { code: string; userId: string };
  externalBank: { name: string; accountNumber: string; bankCode: string };
}

const schema = new Schema<User>(
  {
    name: { type: nameSchema },
    email: {
      type: String,
      trim: true,
      minLength: 5,
      maxLength: 250,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      minLength: 11,
      maxLength: 11,
      unique: true,
      required: true,
    },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    picture: { large: String, medium: String, thumbnail: String },
    password: { type: String, trim: true, required: true },
    address: addressSchema,
    dob: {
      date: Date,
    },
    referrer: {
      code: {
        type: String,
        trim: true,
        minLength: 6,
        maxLength: 6,
        required: true,
      },
      userId: Schema.Types.ObjectId,
    },
    externalBank: {
      name: { type: String, trim: true, minLength: 2, maxLength: 50 },
      accountNumber: { type: String, trim: true, minLength: 10, maxLength: 10 },
      bankCode: { type: String, trim: true, minLength: 3, maxLength: 3 },
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
    { expiresIn: '1h' }
  );
};

export default mongoose.model('user', schema);

export interface SignupData {
  email: string;
  phone: string;
  password: string;
  refCode: string;
}

export function validateSignupData(data: SignupData) {
  const schema = Joi.object({
    email: Joi.string()
      .min(5)
      .max(250)
      .email({ minDomainSegments: 2 })
      .required(),
    phone: Joi.string()
      .trim()
      .min(11)
      .max(11)
      .regex(new RegExp('^[0-9]*$'))
      .required(),
    password: Joi.string().trim().min(6).max(50).required(),
    refCode: Joi.string().trim().min(6).max(6).required(),
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
  userId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  bvn: string;
  bankName: string;
  accountNumber: string;
  bankCode: string;
  birthMonth: string;
  birthDay: string;
  birthYear: string;
}
export function validateKYCData(data: KYCData) {
  const schema = Joi.object({
    userId: Joi.string().trim().required(),
    firstName: Joi.string().trim().min(2).max(25).required(),
    middleName: Joi.string().trim().min(2).max(25),
    lastName: Joi.string().trim().min(2).max(25).required(),
    bvn: Joi.string().trim().min(11).max(11).required(),
    bankName: Joi.string().trim().min(2).max(50).required(),
    accountNumber: Joi.string().trim().min(10).max(10).required(),
    bankCode: Joi.string().trim().min(3).max(3).required(),
    birthMonth: Joi.string().trim().min(2).max(2).required(),
    birthDay: Joi.string().trim().min(2).max(2).required(),
    birthYear: Joi.string().trim().min(4).max(4).required(),
  });

  return schema.validate(data);
}
