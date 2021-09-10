import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';

import User from '../models/user';
import Wallet, {
  validateCreateWalletData,
  CreateWalletData,
} from '../models/wallet';

interface CreateWalletResponse {
  message: string;
  wallet?: {
    id: string;
  };
}

export const createWallet: RequestHandler<
  any,
  CreateWalletResponse,
  CreateWalletData
> = async (req, res, next) => {
  const { error } = validateCreateWalletData(req.body);
  if (error) return res.status(422).send({ message: error.details[0].message });

  const { transferPin } = req.body;
  const userId = req['user'].id;

  try {
    const user = await User.findById(userId);
    if (!user)
      return res.status(400).send({ message: 'No user with the given ID' });

    const fetchedWallet = await Wallet.findOne({ userId });
    if (fetchedWallet)
      return res.status(400).send({ message: 'User has a wallet already' });

    const hashedPin = await bcrypt.hash(transferPin, 12);

    // TODO: Create wallet and update user using a transaction.
    const wallet = await new Wallet({
      transferPin: hashedPin,
      balance: 0.0,
      userId,
    }).save();

    await User.updateOne({ _id: userId }, { walletId: wallet._id });

    res.status(201).send({
      message: 'Wallet created successfully',
      wallet: { id: wallet._id },
    });
  } catch (e) {
    next(new Error('Error in adding user: ' + e));
  }
};
