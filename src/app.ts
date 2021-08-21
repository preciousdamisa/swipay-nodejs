import express from 'express';
import { Mongoose } from 'mongoose';
import config from 'config';

import error from './middleware/error';
import connectToDB from './start/db';

import userRoutes from './routes/user/users';
import authRoute from './routes/user/auth';
import walletRoutes from './routes/wallets';

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoute);
app.use('/api/wallets', walletRoutes);

app.use(error);

connectToDB((db: Mongoose | null, err: Error | null) => {
  if (!err) {
    const PORT = process.env.PORT || config.get('port');
    app.listen(PORT, () => {
      console.log('Connected to DB');
      console.log('Listening on port', PORT);
    });
  } else {
    console.log('Error in connecting to DB: ' + err);
  }
});
