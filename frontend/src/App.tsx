import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useAppSelector } from './hooks/redux';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import DocumentUpload from './components/Auth/DocumentUpload';
import StudentDashboard from './components/Student/StudentDashboard';
import RenterDashboard from './components/Renter/RenterDashboard';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login /> : <Navigate to={user?.userType === 'student' ? '/student/dashboard' : '/renter/dashboard'} />} 
          />
          <Route 
            path="/register" 
            element={!isAuthenticated ? <Register /> : <Navigate to={user?.userType === 'student' ? '/student/dashboard' : '/renter/dashboard'} />} 
          />
          <Route path="/register/documents" element={<DocumentUpload />} />
          
          {/* Protected Routes */}
          <Route 
            path="/student/dashboard" 
            element={isAuthenticated && user?.userType === 'student' ? <StudentDashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/renter/dashboard" 
            element={isAuthenticated && user?.userType === 'renter' ? <RenterDashboard /> : <Navigate to="/login" />} 
          />
          
          {/* Default Routes */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <Navigate to={user?.userType === 'student' ? '/student/dashboard' : '/renter/dashboard'} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;