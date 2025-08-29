import { Response, Request } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserDocument } from '../models/User';
import path from 'path';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';

interface AuthenticatedRequest extends Request {
  user?: UserDocument;
}

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
};

export const registerUser = async (req: AuthenticatedRequest, res: Response) => {
  const { name, email, password, otp, hash, phone, userType } = req.body;

  try {
    const [hashedOtp, expiresAt] = hash.split('.');
    if (Date.now() > parseInt(expiresAt)) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    const data = `${email}.${otp}.${expiresAt}`;
    const newHash = crypto.createHmac('sha256', process.env.OTP_SECRET || 'secure-secret').update(data).digest('hex');

    if (newHash !== hashedOtp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const createdUser = await User.create({ name, email, password, phone, userType });

    const user = createdUser.toObject() as UserDocument & { _id: string };


    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hasPassword: !!user.password,
      },
      token: generateToken(user._id.toString()),
    });
  } catch (err) {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Existing Google Login
export const googleLogin = async (req: AuthenticatedRequest, res: Response) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({ message: 'Invalid Google token payload' });
    }

    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (!user) {
      user = await User.create({ email, name, googleId });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '30d' });

    res.json({
      ...user.toObject(),
      token,
      hasPassword: !!user.password,
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Google authentication failed' });
  }
};

export const loginUser = async (req: AuthenticatedRequest, res: Response) => {

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !user.password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(String(user._id));
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hasPassword: !!user.password,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
};

export const setPassword = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = req.user;

  if (user.password) {
    return res.status(400).json({ message: 'Password already set' });
  }

  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: 'Password set successfully' });
};

export const changePassword = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user?.id).select('+password');
    if (!user || !user.password) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const otpStore = new Map(); 

export const sendOtpToEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 min expiry
  const data = `${email}.${otp}.${expiresAt}`;

  const hash = crypto
    .createHmac('sha256', process.env.OTP_SECRET || 'secure-secret')
    .update(data)
    .digest('hex');

  const fullHash = `${hash}.${expiresAt}`;

  // Send OTP using nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'OTP for Registration',
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({ message: 'OTP sent successfully', hash: fullHash });
};