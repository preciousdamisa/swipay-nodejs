import { Schema } from 'mongoose';

export interface Address {
  street: string;
  localGovt: string;
  city: string;
  state: string;
}

export default new Schema<Address>(
  {
    street: {
      type: String,
      minLength: 2,
      maxLength: 50,
      trim: true,
      required: true,
    },
    localGovt: {
      type: String,
      minLength: 2,
      maxLength: 50,
      trim: true,
      required: true,
    },
    city: {
      type: String,
      minLength: 2,
      maxLength: 25,
      trim: true,
      required: true,
    },
    state: {
      type: String,
      minLength: 2,
      maxLength: 25,
      trim: true,
      required: true,
    },
  },
  { _id: false }
);