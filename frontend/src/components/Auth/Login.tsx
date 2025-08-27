import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { Eye, EyeOff, Mail, Lock, Bike } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector(state => state.auth);
  const { isDark } = useAppSelector(state => state.theme);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    dispatch(loginStart());
    try {
      // Mock login - replace with actual API call
      setTimeout(() => {
        const mockUser = {
          id: '1',
          name: 'John Doe',
          email: data.email,
          phone: '+1234567890',
          userType: data.email.includes('student') ? 'student' : 'renter' as 'student' | 'renter',
          profileCompleted: true,
        };
        
        dispatch(loginSuccess({
          user: mockUser,
          token: 'mock-token-123'
        }));
        
        navigate(mockUser.userType === 'student' ? '/student/dashboard' : '/renter/dashboard');
      }, 1000);
    } catch (error) {
      dispatch(loginFailure());
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${isDark ? 'bg-gradient-to-br from-primary-dark to-secondary-dark' : 'bg-gradient-to-br from-primary-light to-secondary-light'}`}>
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
            Welcome Back
          </h1>
          <p className={`mt-2 ${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>
            Sign in to your RideShare account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-medium rounded-lg hover:shadow-lg transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className={`${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-accent-primary hover:text-accent-secondary font-medium transition-colors duration-200"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;