import jwt from 'jsonwebtoken';
import { IUser } from '@/models/users.models';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';

export const generateToken = (user: IUser) => {
  return jwt.sign(
    { _id: user._id, email: user.email, name: user.name },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};
