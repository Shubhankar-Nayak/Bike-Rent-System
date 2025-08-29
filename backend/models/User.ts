import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserDocument = Document & {
  name: string;
  email: string;
  password: string;
  phone: string;
  googleId?: string;
  userType: 'student' | 'renter';
  profileCompleted: boolean; 
  documents?: {
    aadhar?: string;
    license?: string;
    collegeId?: string;
    rollNumber?: string;
  };
  matchPassword: (password: string) => Promise<boolean>;
};

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false }, // Optional for Google users
  googleId: { type: String }, // Present if signed up via Google
  phone: { type: String, required: true },
  userType: {
    type: String,
    enum: ['student', 'renter'],
    required: true,
  },
  profileCompleted: { 
    type: Boolean, 
    default: false, 
    required: true 
  },
  documents: {
    aadhar: { type: String, default: null },
    license: { type: String, default: null },
    collegeId: { type: String, default: null },
    rollNumber: { type: String, default: null },
  },
}, {
  timestamps: true,
});

// Match entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  if (!this.password) return false; // No password set (Google login)
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = mongoose.model<UserDocument>('User', userSchema);
