import mongoose, { Schema } from 'mongoose';

interface Transaction {
  senderId: string;
  receiverId: string;
  amount: number;
  description: string;
  category: string;
}

const schema = new Schema<Transaction>({
  senderId: { type: Schema.Types.ObjectId, required: true },
  receiverId: { type: Schema.Types.ObjectId, required: true },
  amount: { type: Number, min: 1.0, max: 1000000.0, required: true },
  description: { type: String, trim: true, minLength: 5, maxLength: 250 },
  category: {
    type: String,
    trim: true,
    enum: ['Funded Wallet', 'Airtime', 'Transportation', 'School Fee', 'Other'],
  },
});

export default mongoose.model('transaction', schema);
