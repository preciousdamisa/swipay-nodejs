import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import { customAlphabet } from 'nanoid';

import User from '../../models/user';
import { validateSignupData, SignupData } from '../../models/user';
import VerificationCode, {
  validatePhone,
} from '../../models/verification-code';

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
  { message: string },
  { phone: string }
> = async (req, res, next) => {
  const { error } = validatePhone(req.params);
  if (error) return res.status(422).send({ message: error.details[0].message });

  const { phone } = req.body;

  const code = customAlphabet('0123456789', 6)();
  const message = 'Verification code saved and sent successfully';

  try {
    const fetchedCode = await VerificationCode.findOne({ phone });
    if (fetchedCode) {
      await VerificationCode.updateOne({ phone }, { $set: { code } });
      return res.status(201).send({ message });

      // Call utils function to Send verification code to user.
    }

    await new VerificationCode({ phone, code }).save();

    // Call utils function to Send verification code to user.
    res.status(201).send({ message });
  } catch (e) {
    next(new Error('Error in generating verification code: ' + e));
  }
};
