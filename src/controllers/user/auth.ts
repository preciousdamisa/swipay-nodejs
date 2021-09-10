import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';

import User, { validateAuthData, AuthData } from '../../models/user';
import { Name } from '../../models/schemas/name';

interface AuthResData {
  message: string;
  user?: {
    id: string;
    token: string;
    name: Name;
    email: string;
    phone: string;
  };
}

export const auth: RequestHandler<any, AuthResData, AuthData> = async (
  req,
  res,
  next
) => {
  const { error } = validateAuthData(req.body);
  if (error) return res.status(422).send({ message: error.details[0].message });

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send({ message: 'User not registered!' });

    const isPw = await bcrypt.compare(req.body.password, user.password);
    if (!isPw)
      return res.status(400).send({ message: 'Invalid email or password.' });

    res.send({
      message: 'Login successful!',
      user: {
        id: user._id,
        token: user.genAuthToken(),
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    next(new Error('Error in authenticating user: ' + err));
  }
};
