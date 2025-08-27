import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Vehicle {
  id: string;
  model: string;
  numberPlate: string;
  images: string[];
  yearsOld: number;
  mileage: number;
  papersImage: string;
  pricePerHour: number;
  pickupLocation: string;
  ownerId: string;
  isAvailable: boolean;
  rating: number;
  reviews: number;
}

interface VehicleState {
  vehicles: Vehicle[];
  userVehicles: Vehicle[];
  searchResults: Vehicle[];
  loading: boolean;
  selectedVehicle: Vehicle | null;
}

const initialState: VehicleState = {
  vehicles: [],
  userVehicles: [],
  searchResults: [],
  loading: false,
  selectedVehicle: null,
};

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    setVehicles: (state, action: PayloadAction<Vehicle[]>) => {
      state.vehicles = action.payload;
    },
    setUserVehicles: (state, action: PayloadAction<Vehicle[]>) => {
      state.userVehicles = action.payload;
    },
    addVehicle: (state, action: PayloadAction<Vehicle>) => {
      state.userVehicles.push(action.payload);
    },
    updateVehicle: (state, action: PayloadAction<Vehicle>) => {
      const index = state.userVehicles.findIndex(v => v.id === action.payload.id);
      if (index !== -1) {
        state.userVehicles[index] = action.payload;
      }
    },
    setSelectedVehicle: (state, action: PayloadAction<Vehicle | null>) => {
      state.selectedVehicle = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<Vehicle[]>) => {
      state.searchResults = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setVehicles,
  setUserVehicles,
  addVehicle,
  updateVehicle,
  setSelectedVehicle,
  setSearchResults,
  setLoading,
} = vehicleSlice.actions;
export default vehicleSlice.reducer;