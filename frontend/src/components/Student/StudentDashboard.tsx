import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { setVehicles } from '../../store/slices/vehicleSlice';
import { Search, Star, MapPin, Clock, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import VehicleCard from '../Common/VehicleCard';

const StudentDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { vehicles } = useAppSelector(state => state.vehicles);
  const { isDark } = useAppSelector(state => state.theme);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

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
        ownerId: 'owner1',
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
        pickupLocation: 'Indiranagar, Bangalore',
        ownerId: 'owner2',
        isAvailable: true,
        rating: 4.8,
        reviews: 45,
      },
      {
        id: '3',
        model: 'Hero Destini 125',
        numberPlate: 'KA-03-EF-9012',
        images: ['https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg'],
        yearsOld: 3,
        mileage: 55,
        papersImage: '',
        pricePerHour: 40,
        pickupLocation: 'BTM Layout, Bangalore',
        ownerId: 'owner3',
        isAvailable: false,
        rating: 4.2,
        reviews: 18,
      },
      {
        id: '4',
        model: 'Suzuki Access 125',
        numberPlate: 'KA-04-GH-3456',
        images: ['https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg'],
        yearsOld: 1,
        mileage: 64,
        papersImage: '',
        pricePerHour: 55,
        pickupLocation: 'Electronic City, Bangalore',
        ownerId: 'owner4',
        isAvailable: true,
        rating: 4.7,
        reviews: 32,
      },
    ];
    
    dispatch(setVehicles(mockVehicles));
  }, [dispatch]);

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topPicks = vehicles.filter(v => v.isAvailable && v.rating >= 4.5).slice(0, 3);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-primary-dark' : 'bg-primary-light'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
            Welcome back, {user?.name}! 👋
          </h1>
          <p className={`text-lg ${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>
            Find the perfect ride for your next adventure
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-2xl mb-8 ${isDark ? 'bg-secondary-dark' : 'bg-white'} shadow-lg`}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDark ? 'text-neutral-light opacity-50' : 'text-neutral-dark opacity-50'}`} />
              <input
                type="text"
                placeholder="Search by location or vehicle model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  isDark 
                    ? 'bg-primary-dark border-neutral-dark text-neutral-light placeholder-neutral-light placeholder-opacity-50' 
                    : 'bg-white border-neutral-light text-neutral-dark placeholder-neutral-dark placeholder-opacity-50'
                } focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-200`}
              />
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`px-6 py-3 rounded-lg border ${
                isDark 
                  ? 'border-neutral-dark bg-primary-dark hover:bg-secondary-dark text-neutral-light' 
                  : 'border-neutral-light bg-white hover:bg-neutral-light text-neutral-dark'
              } transition-all duration-200 flex items-center space-x-2`}
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>
        </motion.div>

        {/* Top Picks */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
                Top Picks for You ⭐
              </h2>
              <p className={`${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>
                Highly rated vehicles near you
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topPicks.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <VehicleCard vehicle={vehicle} userType="student" />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* All Available Vehicles */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
                Available Vehicles
              </h2>
              <p className={`${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>
                {filteredVehicles.length} vehicles found
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <VehicleCard vehicle={vehicle} userType="student" />
              </motion.div>
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <div className={`text-center py-12 ${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No vehicles found</p>
              <p>Try adjusting your search or check back later</p>
            </div>
          )}
        </motion.section>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className={`p-6 rounded-xl ${isDark ? 'bg-secondary-dark' : 'bg-white'} text-center shadow-lg`}>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-primary mb-4">
              <Star className="h-6 w-6 text-white" />
            </div>
            <h3 className={`text-2xl font-bold ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>4.6</h3>
            <p className={`${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>Average Rating</p>
          </div>
          
          <div className={`p-6 rounded-xl ${isDark ? 'bg-secondary-dark' : 'bg-white'} text-center shadow-lg`}>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-secondary mb-4">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h3 className={`text-2xl font-bold ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>12</h3>
            <p className={`${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>Pickup Locations</p>
          </div>
          
          <div className={`p-6 rounded-xl ${isDark ? 'bg-secondary-dark' : 'bg-white'} text-center shadow-lg`}>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500 mb-4">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h3 className={`text-2xl font-bold ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>24/7</h3>
            <p className={`${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>Available</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;