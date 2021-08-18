import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import { customAlphabet } from 'nanoid';

import User, {
  validateSignupData,
  SignupData,
  validateKYCData,
  KYCData,
} from '../../models/user';
import VerificationCode, {
  validatePhone,
  sendResponse,
} from '../../models/verification-code';
import {
  sendVerificationCode,
  SendCodeRes,
  checkKYCData,
} from './../../services/user';

interface SignupResData {
  message: string;
  user?: {
    token: string;
    email: string;
    phone: string;
  };
}

export const addUser: RequestHandler<any, SignupResData, SignupData> = async (
  req,
  res,
  next
) => {
  const { error } = validateSignupData(req.body);
  if (error) return res.status(422).send({ message: error.details[0].message });

  const { phone, email, password } = req.body;

  try {
    const fetchedUser = await User.findOne({ $or: [{ phone }, { email }] });
    if (fetchedUser)
      return res.status(400).send({ message: 'User already registered' });

    const hashedPw = await bcrypt.hash(password, 12);
    const user = await new User({
      phone,
      email,
      password: hashedPw,
      balance: 0.0,
    }).save();

    res.status(201).send({
      message: 'Signup successful!',
      user: {
        token: user.genAuthToken(),
        email,
        phone,
      },
    });
  } catch (e) {
    next(new Error('Error in adding user: ' + e));
  }
};

export const getVerificationCode: RequestHandler<
  { phone: string },
  { message: string }
> = async (req, res, next) => {
  const { error } = validatePhone(req.params);
  if (error) return res.status(422).send({ message: error.details[0].message });

  let { phone } = req.params;
  phone = '234' + phone.slice(1);

  const code = customAlphabet('0123456789', 6)();
  let sendCodeRes: SendCodeRes;

  try {
    const fetchedCode = await VerificationCode.findOne({ phone });
    if (fetchedCode) {
      await VerificationCode.updateOne({ phone }, { $set: { code } });

      sendCodeRes = await sendVerificationCode(phone, code);

      return sendResponse(sendCodeRes, res);
    }
    await new VerificationCode({ phone, code }).save();

    sendCodeRes = await sendVerificationCode(phone, code);

    return sendResponse(sendCodeRes, res);
  } catch (e) {
    next(new Error('Error in generating verification code: ' + e));
  }
};

export const verifyKYCData: RequestHandler<any, any, KYCData> = async (
  req,
  res,
  next
) => {
  const { error } = validateKYCData(req.body);
  if (error) return res.status(422).send({ message: error.details[0].message });

  try {
    const response = await checkKYCData(req.body);
  } catch (e) {
    next(new Error("Error in verifying user's data: " + e));
  }
};
