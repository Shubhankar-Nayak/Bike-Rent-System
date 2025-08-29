import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { register as registerAction, registerUser } from '../../store/slices/authSlice';
import { Eye, EyeOff, Mail, Lock, Phone, User, Bike, GraduationCap, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  userType: 'student' | 'renter';
}

const Register: React.FC = () => {
  const API = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isDark } = useAppSelector(state => state.theme);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState('');
  const [otp, setOtp] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [hash, setHash] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userT, setUser] = useState('');
  const [otpStep, setOtpStep] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch('password');
  const userType = watch('userType');

  const onSubmit = async (data: RegisterForm) => {

    try {
      const response = await axios.post(`${API}/user/send-otp`, {
        email: data.email,
      });
      setUserName(data.name);
      setUserEmail(data.email);
      setUserPassword(data.password);
      setHash(response.data.hash);
      setEmailForVerification(data.email);
      setPhoneNumber(data.phone);
      setUser(data.userType);

      setOtpStep(true);
    } catch (error: any) {
      console.error('Registration error:', error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const { user, token } = await registerUser({
        name: userName,
        email: userEmail,
        password: userPassword,
        otp,
        hash,
        phone: phoneNumber,    
        userType: userT,
      });
      dispatch(registerAction({ user, token }));

      localStorage.setItem('userInfo', JSON.stringify({ user, token }));

      navigate('/register/documents', { 
        state: { 
          userType: userT,
          userData: { name: userName, email: userEmail, phone: phoneNumber }, 
        } 
      });
    } catch (error: any) {
      alert(error.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 ${isDark ? 'bg-gradient-to-br from-primary-dark to-secondary-dark' : 'bg-gradient-to-br from-primary-light to-secondary-light'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-md w-full ${isDark ? 'bg-secondary-dark' : 'bg-white'} rounded-2xl shadow-2xl p-8 border ${isDark ? 'border-neutral-dark' : 'border-neutral-light'}`}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary mb-4">
            <Bike className="h-8 w-8 text-white" />
          </div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
            Join RideShare
          </h1>
          <p className={`mt-2 ${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>
            Create your account to get started
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* User Type Selection */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
              I am a
            </label>
            <div className="grid grid-cols-2 gap-3">
              <motion.label
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  userType === 'student'
                    ? 'border-accent-primary bg-accent-primary bg-opacity-10'
                    : isDark
                    ? 'border-neutral-dark hover:border-accent-primary'
                    : 'border-neutral-light hover:border-accent-primary'
                }`}
              >
                <GraduationCap className={`h-8 w-8 mb-2 ${userType === 'student' ? 'text-accent-primary' : isDark ? 'text-neutral-light' : 'text-neutral-dark'}`} />
                <span className={`font-medium ${userType === 'student' ? 'text-accent-primary' : isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
                  Student
                </span>
                <input
                  {...register('userType', { required: 'Please select your user type' })}
                  type="radio"
                  value="student"
                  className="sr-only"
                />
              </motion.label>

              <motion.label
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  userType === 'renter'
                    ? 'border-accent-primary bg-accent-primary bg-opacity-10'
                    : isDark
                    ? 'border-neutral-dark hover:border-accent-primary'
                    : 'border-neutral-light hover:border-accent-primary'
                }`}
              >
                <Building2 className={`h-8 w-8 mb-2 ${userType === 'renter' ? 'text-accent-primary' : isDark ? 'text-neutral-light' : 'text-neutral-dark'}`} />
                <span className={`font-medium ${userType === 'renter' ? 'text-accent-primary' : isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
                  Vehicle Owner
                </span>
                <input
                  {...register('userType', { required: 'Please select your user type' })}
                  type="radio"
                  value="renter"
                  className="sr-only"
                />
              </motion.label>
            </div>
            {errors.userType && (
              <p className="mt-1 text-sm text-red-500">{errors.userType.message}</p>
            )}
          </div>

          {/* Name Field */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
              Full Name
            </label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDark ? 'text-neutral-light opacity-50' : 'text-neutral-dark opacity-50'}`} />
              <input
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
                type="text"
                placeholder="Enter your full name"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  isDark 
                    ? 'bg-primary-dark border-neutral-dark text-neutral-light placeholder-neutral-light placeholder-opacity-50' 
                    : 'bg-white border-neutral-light text-neutral-dark placeholder-neutral-dark placeholder-opacity-50'
                } focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-200`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
              Email Address
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDark ? 'text-neutral-light opacity-50' : 'text-neutral-dark opacity-50'}`} />
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address',
                  },
                })}
                type="email"
                placeholder="Enter your email"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  isDark 
                    ? 'bg-primary-dark border-neutral-dark text-neutral-light placeholder-neutral-light placeholder-opacity-50' 
                    : 'bg-white border-neutral-light text-neutral-dark placeholder-neutral-dark placeholder-opacity-50'
                } focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-200`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
              Phone Number
            </label>
            <div className="relative">
              <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDark ? 'text-neutral-light opacity-50' : 'text-neutral-dark opacity-50'}`} />
              <input
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[+]?[\d\s\-\(\)]{10,}$/,
                    message: 'Invalid phone number',
                  },
                })}
                type="tel"
                placeholder="Enter your phone number"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  isDark 
                    ? 'bg-primary-dark border-neutral-dark text-neutral-light placeholder-neutral-light placeholder-opacity-50' 
                    : 'bg-white border-neutral-light text-neutral-dark placeholder-neutral-dark placeholder-opacity-50'
                } focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-200`}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
              Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDark ? 'text-neutral-light opacity-50' : 'text-neutral-dark opacity-50'}`} />
              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-12 py-3 rounded-lg border ${
                  isDark 
                    ? 'bg-primary-dark border-neutral-dark text-neutral-light placeholder-neutral-light placeholder-opacity-50' 
                    : 'bg-white border-neutral-light text-neutral-dark placeholder-neutral-dark placeholder-opacity-50'
                } focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-200`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-neutral-light opacity-50 hover:opacity-100' : 'text-neutral-dark opacity-50 hover:opacity-100'} transition-opacity`}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
              Confirm Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDark ? 'text-neutral-light opacity-50' : 'text-neutral-dark opacity-50'}`} />
              <input
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value =>
                    value === password || 'Passwords do not match',
                })}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                className={`w-full pl-10 pr-12 py-3 rounded-lg border ${
                  isDark 
                    ? 'bg-primary-dark border-neutral-dark text-neutral-light placeholder-neutral-light placeholder-opacity-50' 
                    : 'bg-white border-neutral-light text-neutral-dark placeholder-neutral-dark placeholder-opacity-50'
                } focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-200`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-neutral-light opacity-50 hover:opacity-100' : 'text-neutral-dark opacity-50 hover:opacity-100'} transition-opacity`}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-medium rounded-lg hover:shadow-lg transform transition-all duration-200"
          >
            Continue to Document Upload
          </motion.button>
        </form>

        {/* OTP Step */}
        {otpStep && (
          <div className="mt-6">
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
              Enter OTP
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className={`flex-1 px-4 py-3 rounded-lg border ${
                  isDark
                    ? 'bg-primary-dark border-neutral-dark text-neutral-light'
                    : 'bg-white border-neutral-light text-neutral-dark'
                } focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-200`}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleVerifyOtp}
                className="px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Verify
              </motion.button>
            </div>
          </div>
        )}


        {/* Footer */}
        <div className="mt-6 text-center">
          <p className={`${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-accent-primary hover:text-accent-secondary font-medium transition-colors duration-200"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;