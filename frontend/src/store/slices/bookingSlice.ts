import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Booking {
  id: string;
  vehicleId: string;
  studentId: string;
  duration: 3 | 6 | 12 | 24;
  totalPrice: number;
  startTime: string;
  endTime: string;
  status: 'active' | 'completed' | 'cancelled';
  pickupLocation: string;
  hasLocationDiscount: boolean;
}

interface BookingState {
  bookings: Booking[];
  activeBooking: Booking | null;
  loading: boolean;
}

const initialState: BookingState = {
  bookings: [],
  activeBooking: null,
  loading: false,
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setBookings: (state, action: PayloadAction<Booking[]>) => {
      state.bookings = action.payload;
    },
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.push(action.payload);
    },
    setActiveBooking: (state, action: PayloadAction<Booking | null>) => {
      state.activeBooking = action.payload;
    },
    updateBookingStatus: (state, action: PayloadAction<{ id: string; status: Booking['status'] }>) => {
      const booking = state.bookings.find(b => b.id === action.payload.id);
      if (booking) {
        booking.status = action.payload.status;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setBookings,
  addBooking,
  setActiveBooking,
  updateBookingStatus,
  setLoading,
} = bookingSlice.actions;
export default bookingSlice.reducer;