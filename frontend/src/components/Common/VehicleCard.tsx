import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { Vehicle } from '../../store/slices/vehicleSlice';
import { Star, MapPin, Fuel, Calendar, DollarSign, Eye, Edit } from 'lucide-react';
import { motion } from 'framer-motion';

interface VehicleCardProps {
  vehicle: Vehicle;
  userType: 'student' | 'renter';
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, userType }) => {
  const navigate = useNavigate();
  const { isDark } = useAppSelector(state => state.theme);

  const handleCardClick = () => {
    if (userType === 'student') {
      navigate(`/student/vehicle/${vehicle.id}`);
    } else {
      navigate(`/renter/vehicle/${vehicle.id}`);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/renter/vehicle/${vehicle.id}/edit`);
  };

  const studentPrice = Math.round(vehicle.pricePerHour * 1.5);

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      className={`cursor-pointer rounded-2xl overflow-hidden shadow-lg ${
        isDark ? 'bg-secondary-dark border border-neutral-dark' : 'bg-white border border-neutral-light'
      } hover:shadow-xl transition-all duration-300`}
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={vehicle.images[0] || 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg'}
          alt={vehicle.model}
          className="w-full h-full object-cover"
        />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              vehicle.isAvailable
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {vehicle.isAvailable ? 'Available' : 'In Use'}
          </span>
        </div>

        {/* Edit Button for Renter */}
        {userType === 'renter' && (
          <button
            onClick={handleEditClick}
            className="absolute top-4 right-4 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all duration-200"
          >
            <Edit className="h-4 w-4" />
          </button>
        )}

        {/* Rating Badge */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center space-x-1 bg-black bg-opacity-50 rounded-full px-2 py-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-medium">
              {vehicle.rating.toFixed(1)}
            </span>
            <span className="text-white text-xs opacity-70">
              ({vehicle.reviews})
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Model & Number Plate */}
        <div className="mb-4">
          <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
            {vehicle.model}
          </h3>
          <p className={`text-sm ${isDark ? 'text-accent-primary' : 'text-accent-secondary'} font-medium`}>
            {vehicle.numberPlate}
          </p>
        </div>

        {/* Vehicle Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <MapPin className={`h-4 w-4 ${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`} />
              <span className={`${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>
                {vehicle.pickupLocation}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Fuel className={`h-4 w-4 ${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`} />
              <span className={`${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>
                {vehicle.mileage} km/l
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className={`h-4 w-4 ${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`} />
              <span className={`${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>
                {vehicle.yearsOld} years old
              </span>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-1">
                <DollarSign className={`h-5 w-5 ${isDark ? 'text-accent-primary' : 'text-accent-secondary'}`} />
                <span className={`text-2xl font-bold ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
                  ₹{userType === 'student' ? studentPrice : vehicle.pricePerHour}
                </span>
                <span className={`text-sm ${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>
                  /hour
                </span>
              </div>
              {userType === 'student' && (
                <p className={`text-xs ${isDark ? 'text-neutral-light opacity-50' : 'text-neutral-dark opacity-50'}`}>
                  Base rate: ₹{vehicle.pricePerHour}/hour
                </p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                vehicle.isAvailable
                  ? userType === 'student'
                    ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:shadow-lg'
                    : 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!vehicle.isAvailable && userType === 'student'}
            >
              {userType === 'student' ? (
                vehicle.isAvailable ? 'Book Now' : 'Unavailable'
              ) : (
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </div>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VehicleCard;