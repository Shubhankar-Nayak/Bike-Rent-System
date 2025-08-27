import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch } from './redux';
import { setVehicles } from '../store/slices/vehicleSlice';

export const useSocket = (token: string | null) => {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token) {
      socketRef.current = io('ws://localhost:3001', {
        auth: { token },
      });

      socketRef.current.on('vehicleUpdate', (vehicles) => {
        dispatch(setVehicles(vehicles));
      });

      socketRef.current.on('bookingUpdate', (booking) => {
        // Handle booking updates
        console.log('Booking updated:', booking);
      });

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [token, dispatch]);

  return socketRef.current;
};