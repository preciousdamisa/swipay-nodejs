import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';

import User from '../models/user';
import Wallet, {
  validateCreateWalletReq,
  CreateWalletReq,
  validateGetOwnerReq,
  GetOwnerReq,
} from '../models/wallet';

interface CreateWalletRes {
  message: string;
  wallet?: {
    id: string;
    phone: string;
  };
}

export const createWallet: RequestHandler<
  any,
  CreateWalletRes,
  CreateWalletReq
> = async (req, res, next) => {
  const { error } = validateCreateWalletReq(req.body);
  if (error) return res.status(422).send({ message: error.details[0].message });

  const { transferPin } = req.body;
  const userId = req['user'].id;

  try {
    const user = await User.findById(userId).select('phone');
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
      user: userId,
      phone: user.phone,
    }).save();

    await User.updateOne({ _id: userId }, { walletId: wallet._id });

    res.status(201).send({
      message: 'Wallet created successfully',
      wallet: { id: wallet._id, phone: wallet.phone },
    });
  } catch (e) {
    next(new Error('Error in adding user: ' + e));
  }
};

interface GetOwnerRes {
  message: string;
  owner?: { fullName: string };
}

export const getOwner: RequestHandler<any, GetOwnerRes, GetOwnerReq> = async (
  req,
  res,
  next
) => {
  const { error } = validateGetOwnerReq(req.body);
  if (error) return res.status(422).send({ message: error.details[0].message });

  try {
    const wallet = await Wallet.findOne({
      phone: req.body.walletPhone,
    })
      .populate('user', 'name')
      .select('user -_id');

    if (!wallet)
      return res
        .status(404)
        .send({ message: 'No wallet with the given phone number' });

    const { first, middle, last } = wallet.user.name;

    const owner = { fullName: `${first} ${middle} ${last}` };

    res.send({ message: 'Owner fetched successfully', owner });
  } catch (e) {
    next(new Error('Error in adding user: ' + e));
  }
};

interface FundWalletResponse {
  message: string;
  amount: number;
  balance: number;
  transactionId: string;
}

export const fundWallet: RequestHandler<any, FundWalletResponse> = async (
  req,
  res,
  next
) => {};
