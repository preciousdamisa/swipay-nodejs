import { Schema } from 'mongoose';

export interface Name {
  title?: string;
  first: string;
  middle?: string;
  surname: string;
}

export default new Schema<Name>(
  {
    title: { type: String, maxLength: 25, trim: true },
    first: { type: String, maxLength: 25, trim: true, required: true },
    middle: { type: String, maxLength: 25, trim: true },
    surname: { type: String, maxLength: 25, trim: true, required: true },
  },
  { _id: false }
);
