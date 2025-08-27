import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/themeSlice';
import { Bike, Moon, Sun, LogOut, User, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const { isDark } = useAppSelector(state => state.theme);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <nav className={`sticky top-0 z-50 ${isDark ? 'bg-primary-dark' : 'bg-primary-light'} border-b ${isDark ? 'border-neutral-dark' : 'border-neutral-light'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg bg-accent-primary group-hover:bg-accent-secondary transition-colors duration-200">
              <Bike className="h-6 w-6 text-white" />
            </div>
            <span className={`text-xl font-bold ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
              RideShare
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated && (
              <>
                <Link
                  to={user?.userType === 'student' ? '/student/dashboard' : '/renter/dashboard'}
                  className={`${isDark ? 'text-neutral-light hover:text-accent-primary' : 'text-neutral-dark hover:text-accent-secondary'} transition-colors duration-200`}
                >
                  Dashboard
                </Link>
                {user?.userType === 'student' && (
                  <Link
                    to="/student/search"
                    className={`${isDark ? 'text-neutral-light hover:text-accent-primary' : 'text-neutral-dark hover:text-accent-secondary'} transition-colors duration-200`}
                  >
                    Find Rides
                  </Link>
                )}
                {user?.userType === 'renter' && (
                  <Link
                    to="/renter/vehicles"
                    className={`${isDark ? 'text-neutral-light hover:text-accent-primary' : 'text-neutral-dark hover:text-accent-secondary'} transition-colors duration-200`}
                  >
                    My Vehicles
                  </Link>
                )}
              </>
            )}

            <button
              onClick={handleThemeToggle}
              className={`p-2 rounded-lg ${isDark ? 'bg-secondary-dark hover:bg-neutral-dark' : 'bg-secondary-light hover:bg-neutral-light'} transition-colors duration-200`}
            >
              {isDark ? <Sun className="h-5 w-5 text-accent-primary" /> : <Moon className="h-5 w-5 text-accent-secondary" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-full bg-accent-primary">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className={`font-medium ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg ${isDark ? 'text-neutral-light hover:text-accent-primary' : 'text-neutral-dark hover:text-accent-secondary'} transition-colors duration-200`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-accent-primary hover:bg-accent-secondary text-white transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={`h-6 w-6 ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`md:hidden py-4 border-t ${isDark ? 'border-neutral-dark bg-primary-dark' : 'border-neutral-light bg-primary-light'}`}
          >
            <div className="flex flex-col space-y-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to={user?.userType === 'student' ? '/student/dashboard' : '/renter/dashboard'}
                    className={`px-4 py-2 ${isDark ? 'text-neutral-light hover:text-accent-primary' : 'text-neutral-dark hover:text-accent-secondary'} transition-colors duration-200`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="px-4 py-2 flex items-center justify-between">
                    <span className={`font-medium ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
                      {user?.name}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`px-4 py-2 ${isDark ? 'text-neutral-light hover:text-accent-primary' : 'text-neutral-dark hover:text-accent-secondary'} transition-colors duration-200`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="mx-4 px-4 py-2 rounded-lg bg-accent-primary hover:bg-accent-secondary text-white transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
              <div className="px-4 py-2">
                <button
                  onClick={handleThemeToggle}
                  className={`p-2 rounded-lg ${isDark ? 'bg-secondary-dark hover:bg-neutral-dark' : 'bg-secondary-light hover:bg-neutral-light'} transition-colors duration-200`}
                >
                  {isDark ? <Sun className="h-5 w-5 text-accent-primary" /> : <Moon className="h-5 w-5 text-accent-secondary" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;