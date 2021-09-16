import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';

import User from '../models/user';
import Wallet from '../models/wallet';
import Transaction, {
  validateStartTransactionReq,
  validateGetReceiverNameReq,
  validateFinishTransactionReq,
  StartTransactionReq,
  GetReceiverNameParams,
  FinishTransactionReq,
} from '../models/transaction';

interface StartTransactionRes {
  message: string;
  data?: { senderName: string; receiverName: string };
}

export const startTransaction: RequestHandler<
  any,
  StartTransactionRes,
  StartTransactionReq
> = async (req, res, next) => {
  const { error } = validateStartTransactionReq(req.body);
  if (error) return res.status(422).send({ message: error.details[0].message });

  const senderUserId = req['user'].id;
  const receiverPhone = req.body.receiverPhone;

  try {
    const sender = await User.findById(senderUserId).select('name');
    if (!sender) return res.status(404).send({ message: 'Sender not found' });

    const receiver = await User.findOne({ phone: receiverPhone }).select(
      'name'
    );
    if (!receiver)
      return res
        .status(404)
        .send({ message: 'No user with the given phone number' });

    const senderName = `${sender.name.first} ${sender.name.last}`;
    const receiverName = `${receiver.name.first} ${receiver.name.last}`;

    res.send({
      message: 'Users information fetched successfully',
      data: { senderName, receiverName },
    });
  } catch (e) {
    next(new Error('Error in starting transaction: ' + e));
  }
};

interface FinishTransactionRes {
  message: string;
  data?: {
    senderName: string;
    receiverName: string;
    amount: number;
    transactionId: string;
  };
}

// TODO: Use a Transaction (Session) to finish transaction.
// TODO: Check that user is not trying to send money to self.
export const finishTransaction: RequestHandler<
  any,
  FinishTransactionRes,
  FinishTransactionReq
> = async (req, res, next) => {
  const { error } = validateFinishTransactionReq(req.body);
  if (error) return res.status(422).send({ message: error.details[0].message });

  const senderUserId = req['user'].id;
  const { receiverPhone, amount, transferPin } = req.body;

  try {
    const sender = await User.findById(senderUserId).select(
      'name _id walletId'
    );
    if (!sender) return res.status(404).send({ message: 'Sender not found' });

    const receiver = await User.findOne({ phone: receiverPhone }).select(
      'name _id walletId'
    );
    if (!receiver)
      return res
        .status(404)
        .send({ message: 'No user with the given phone number' });

    const senderWallet = await Wallet.findById(sender.walletId).select(
      '_id transferPin balance'
    );
    if (!senderWallet)
      return res
        .status(404)
        .send({ message: "Sender doesn't have a wallet account" });

    const receiverWallet = await Wallet.findById(receiver.walletId).select(
      '_id'
    );
    if (!receiverWallet)
      return res
        .status(404)
        .send({ message: "Receiver doesn't have a wallet account" });

    const isPin = await bcrypt.compare(transferPin, senderWallet.transferPin);
    if (!isPin) return res.status(400).send({ message: 'Incorrect pin' });

    if (amount > senderWallet.balance)
      return res.status(400).send({ message: 'Insufficient balance' });

    await Wallet.updateOne(
      { _id: senderWallet._id },
      { $inc: { balance: -amount } }
    );
    await Wallet.updateOne(
      { _id: receiverWallet._id },
      { $inc: { balance: amount } }
    );

    const transaction = await new Transaction({
      senderId: sender._id,
      receiverId: receiver._id,
      amount,
    }).save();

    const senderName = `${sender.name.first} ${sender.name.last}`;
    const receiverName = `${receiver.name.first} ${receiver.name.last}`;

    res.send({
      message: 'Transaction successful',
      data: {
        senderName,
        receiverName,
        amount,
        transactionId: transaction._id,
      },
    });
  } catch (e) {
    next(new Error('Error in completing transaction: ' + e));
  }
};

interface GetReceiverNameRes {
  message: string;
  receiver?: { fullName: string };
}

export const getReceiverName: RequestHandler<
  GetReceiverNameParams,
  GetReceiverNameRes
> = async (req, res, next) => {
  const { error } = validateGetReceiverNameReq(req.params);
  if (error) return res.status(422).send({ message: error.details[0].message });

  try {
    const wallet = await Wallet.findOne({
      phone: req.params.receiverPhone,
    })
      .populate('user', 'name')
      .select('user -_id');

    console.log(wallet);

    // Receiver hasn't done KYC
    if (!wallet.user.name)
      return res
        .status(400)
        .send({ message: "Receiver's account hasn't been verified" });

    if (!wallet)
      return res
        .status(404)
        .send({ message: 'No wallet with the given phone number' });

    const { first, middle, last } = wallet.user.name;

    const receiver = { fullName: `${first} ${middle} ${last}` };

    res.send({ message: "Receiver's name gotten successfully", receiver });
  } catch (e) {
    next(new Error('Error in adding user: ' + e));
  }
};
