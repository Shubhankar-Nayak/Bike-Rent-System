import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  hasPassword?: boolean;
  userType: 'student' | 'renter';
  profileCompleted: boolean;
  documents?: {
    aadhar?: string;
    license?: string;
    collegeId?: string;
    rollNumber?: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
};

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const registerUserThunk = createAsyncThunk<
  { user: User; token: string }, 
  {
    name: string;
    email: string;
    password: string;
    otp: string;
    hash: string;
    phone: string;
    userType: 'student' | 'renter';
  }
>(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/user/register`, formData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const setPassword = createAsyncThunk<
  void,
  { newPassword: string },
  { state: RootState }
>('auth/setPassword', async ({ newPassword }, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    await axios.post(`${API}/user/set-password`, { newPassword }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to set password');
  }
});

export const changePassword = createAsyncThunk<
  void,
  { currentPassword: string; newPassword: string },
  { state: RootState }
>('auth/changePassword', async ({ currentPassword, newPassword }, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    await axios.post(`${API}/user/change-password`, { currentPassword, newPassword }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to change password');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user } = action.payload;

      const profileCompleted = 
        !!user.documents?.aadhar && 
        !!user.documents?.license && 
        !!user.documents?.collegeId && 
        !!user.documents?.rollNumber;

      state.user = {
        id: action.payload.user.id,
        email: action.payload.user.email,
        name: action.payload.user.name,
        phone: action.payload.user.phone,
        userType: action.payload.user.userType,
        hasPassword: action.payload.user.hasPassword ?? false,
        profileCompleted,
      };
      state.loading = false;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    loginFailure: (state) => {
      state.loading = false;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    register: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user } = action.payload;

      const profileCompleted = 
        !!user.documents?.aadhar && 
        !!user.documents?.license && 
        !!user.documents?.collegeId && 
        !!user.documents?.rollNumber;

      state.user = {
        id: action.payload.user.id,
        email: action.payload.user.email,
        name: action.payload.user.name,
        phone: action.payload.user.phone,
        userType: action.payload.user.userType,
        hasPassword: action.payload.user.hasPassword ?? false, 
        profileCompleted,
      };
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, register, updateProfile } = authSlice.actions;
export default authSlice.reducer;