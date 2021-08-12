import mongoose, { Mongoose } from 'mongoose';

const url = 'mongodb://localhost:27017/swipay';
export default (cb: (db: Mongoose | null, err: Error | null) => void) => {
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((res) => {
      cb(res, null);
    })
    .catch((err) => {
      cb(null, err);
    });
};
