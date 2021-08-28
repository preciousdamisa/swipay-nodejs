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
  validateCode,
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

  const { email, phone, password, refCode } = req.body;

  try {
    const fetchedUser = await User.findOne({ $or: [{ phone }, { email }] });
    if (fetchedUser)
      return res.status(400).send({ message: 'User already registered' });

    const referrer = await User.findOne({ referralCode: refCode });
    if (!referrer)
      return res
        .status(400)
        .send({ message: 'No user with this referral code' });

    const hashedPw = await bcrypt.hash(password, 12);

    const user = await new User({
      email,
      phone,
      password: hashedPw,
      referrer: { code: refCode, userId: referrer._id },
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

    sendResponse(sendCodeRes, res);
  } catch (e) {
    next(new Error('Error in generating verification code: ' + e));
  }
};

export const verifyCode: RequestHandler<any> = async (req, res, next) => {
  const { error } = validateCode(req.body);
  if (error) return res.status(422).send({ message: error.details[0].message });

  try {
    const fetchedCode = await VerificationCode.findOne({
      phone: req.body.phone,
      code: req.body.code,
    });
    if (!fetchedCode) return res.status(404).send({ message: '' });

    res.send({ message: 'Verified code successfully' });
  } catch (e) {
    next(new Error('Error in verifying code: ' + e));
  }
};

export const verifyKYCData: RequestHandler<any, {message: string}, KYCData> = async (
  req,
  res,
  next
) => {
  const { error } = validateKYCData(req.body);
  if (error) return res.status(422).send({ message: error.details[0].message });

  const {
    userId,
    firstName,
    lastName,
    bankName,
    accountNumber,
    bankCode,
    birthMonth,
    birthDay,
    birthYear,
  } = req.body;

  const dob = new Date(+birthYear, +birthMonth - 1, +birthDay - 1, 0, 0, 0, 0);

  const middleName = req.body.middleName;

  try {
    await User.updateOne(
      { _id: userId },
      {
        name: {
          first: firstName,
          middle:
            middleName === '' || middleName === undefined ? '' : middleName,
          last: lastName,
        },
        externalBank: { name: bankName, accountNumber, bankCode },
        'dob.date': dob,
      }
    );
    // const response = await checkKYCData(req.body);
    // if (response.status) {
    //   res.send({ message: 'Verification successful' });
    // } else {
    //   res.status(400).send({
    //     message: 'Invalid data! Please ensure all provided data is correct',
    //   });
    // }

    res.send({message: 'Verification successful'});
  } catch (e) {
    next(new Error('Error in verifying data: ' + e));
  }
};
