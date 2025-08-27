import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import vehicleSlice from './slices/vehicleSlice';
import bookingSlice from './slices/bookingSlice';
import themeSlice from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    vehicles: vehicleSlice,
    bookings: bookingSlice,
    theme: themeSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;