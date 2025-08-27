import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { setUserVehicles } from '../../store/slices/vehicleSlice';
import { Plus, Car, DollarSign, Star, TrendingUp, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import VehicleCard from '../Common/VehicleCard';

const RenterDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { userVehicles } = useAppSelector(state => state.vehicles);
  const { isDark } = useAppSelector(state => state.theme);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockVehicles = [
      {
        id: '1',
        model: 'Honda Activa 6G',
        numberPlate: 'KA-01-AB-1234',
        images: ['https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg'],
        yearsOld: 2,
        mileage: 60,
        papersImage: '',
        pricePerHour: 50,
        pickupLocation: 'Koramangala, Bangalore',
        ownerId: user?.id || '',
        isAvailable: true,
        rating: 4.5,
        reviews: 23,
      },
      {
        id: '2',
        model: 'TVS Jupiter',
        numberPlate: 'KA-02-CD-5678',
        images: ['https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg'],
        yearsOld: 1,
        mileage: 65,
        papersImage: '',
        pricePerHour: 45,
        pickupLocation: 'Koramangala, Bangalore',
        ownerId: user?.id || '',
        isAvailable: false,
        rating: 4.8,
        reviews: 45,
      },
    ];
    
    dispatch(setUserVehicles(mockVehicles));
  }, [dispatch, user?.id]);

  const totalRevenue = userVehicles.reduce((sum, vehicle) => sum + (vehicle.pricePerHour * 100), 0);
  const averageRating = userVehicles.reduce((sum, vehicle) => sum + vehicle.rating, 0) / userVehicles.length || 0;
  const availableVehicles = userVehicles.filter(v => v.isAvailable).length;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-primary-dark' : 'bg-primary-light'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
              Welcome, {user?.name}! 🚗
            </h1>
            <p className={`text-lg ${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>
              Manage your vehicle fleet and track earnings
            </p>
          </div>
          <Link to="/renter/vehicles/add">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 md:mt-0 inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Add Vehicle</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className={`p-6 rounded-xl ${isDark ? 'bg-secondary-dark' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>
                  Total Vehicles
                </p>
                <p className={`text-3xl font-bold ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
                  {userVehicles.length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-accent-primary bg-opacity-20">
                <Car className="h-8 w-8 text-accent-primary" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${isDark ? 'bg-secondary-dark' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>
                  Available Now
                </p>
                <p className={`text-3xl font-bold ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
                  {availableVehicles}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-500 bg-opacity-20">
                <Eye className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${isDark ? 'bg-secondary-dark' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>
                  Monthly Revenue
                </p>
                <p className={`text-3xl font-bold ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
                  ₹{totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-500 bg-opacity-20">
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${isDark ? 'bg-secondary-dark' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>
                  Average Rating
                </p>
                <p className={`text-3xl font-bold ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
                  {averageRating.toFixed(1)}
                </p>
              </div>
              <div className="p-3 rounded-full bg-yellow-500 bg-opacity-20">
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-2xl mb-8 ${isDark ? 'bg-secondary-dark' : 'bg-white'} shadow-lg`}
        >
          <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/renter/vehicles/add"
              className={`p-4 rounded-lg border-2 border-dashed ${
                isDark 
                  ? 'border-neutral-dark hover:border-accent-primary bg-primary-dark hover:bg-secondary-dark' 
                  : 'border-neutral-light hover:border-accent-primary bg-neutral-light hover:bg-white'
              } transition-all duration-200 text-center group`}
            >
              <Plus className={`h-8 w-8 mx-auto mb-2 ${isDark ? 'text-neutral-light opacity-70 group-hover:text-accent-primary' : 'text-neutral-dark opacity-70 group-hover:text-accent-primary'}`} />
              <p className={`font-medium ${isDark ? 'text-neutral-light group-hover:text-accent-primary' : 'text-neutral-dark group-hover:text-accent-primary'}`}>
                Add New Vehicle
              </p>
            </Link>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-primary-dark' : 'bg-neutral-light'} text-center`}>
              <TrendingUp className={`h-8 w-8 mx-auto mb-2 ${isDark ? 'text-accent-primary' : 'text-accent-secondary'}`} />
              <p className={`font-medium ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
                View Analytics
              </p>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-primary-dark' : 'bg-neutral-light'} text-center`}>
              <DollarSign className={`h-8 w-8 mx-auto mb-2 ${isDark ? 'text-accent-primary' : 'text-accent-secondary'}`} />
              <p className={`font-medium ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
                Manage Pricing
              </p>
            </div>
          </div>
        </motion.div>

        {/* Your Vehicles */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
                Your Vehicles
              </h2>
              <p className={`${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>
                {userVehicles.length} vehicles in your fleet
              </p>
            </div>
            <Link
              to="/renter/vehicles"
              className={`text-accent-primary hover:text-accent-secondary font-medium transition-colors duration-200`}
            >
              View All →
            </Link>
          </div>

          {userVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userVehicles.slice(0, 6).map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <VehicleCard vehicle={vehicle} userType="renter" />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-12 ${isDark ? 'bg-secondary-dark' : 'bg-white'} rounded-2xl shadow-lg`}>
              <Car className={`h-16 w-16 mx-auto mb-4 ${isDark ? 'text-neutral-light opacity-30' : 'text-neutral-dark opacity-30'}`} />
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
                No vehicles yet
              </h3>
              <p className={`mb-6 ${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>
                Add your first vehicle to start earning money
              </p>
              <Link to="/renter/vehicles/add">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-medium rounded-lg"
                >
                  Add Your First Vehicle
                </motion.button>
              </Link>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default RenterDashboard;