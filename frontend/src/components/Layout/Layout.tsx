import React from 'react';
import { useAppSelector } from '../../hooks/redux';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDark } = useAppSelector(state => state.theme);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-primary-dark text-neutral-light' : 'bg-primary-light text-neutral-dark'} transition-colors duration-300`}>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;