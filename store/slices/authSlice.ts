import { AuthState, VerifyOtpData } from '@/types/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export const verifyOtp = createAsyncThunk('/api/verify-otp', async (data: VerifyOtpData) => {
  try {
    const promise = axios.post('/api/auth/login/verify-otp', data);
    const message = (await promise).data.message;
    toast.promise(promise, {
      loading: 'Waiting to verify the otp',
      success: message,
      error: message,
    });
    const res = await promise;
    console.log(res.data.user.role);
    return res.data;
  } catch (error) {
    toast.error(String(error));
    throw error;
  }
});

export const logoutUser = createAsyncThunk('/auth/logout', async () => {
  try {
    const promise = axios.get('/api/account/logout');
    const message = (await promise).data.message;
    toast.promise(promise, {
      loading: 'Logging out',
      success: message,
      error: message,
    });

    const res = await promise;
    return res.data;
  } catch (error) {
    toast.error(String(error));
  }
});

// Initialize state from localStorage if available
const getInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('role');

    return {
      loading: false,
      user: isLoggedIn && role ? { role } : null,
      isLoggedIn,
    };
  }

  return {
    loading: false,
    user: null,
    isLoggedIn: false,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: state => {
      state.loading = false;
      state.isLoggedIn = false;
      state.user = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(verifyOtp.pending, state => {
        state.loading = true;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', action.payload.user.role);
        state.user = action.payload.user;
        state.isLoggedIn = true;
        state.loading = false;
      })
      .addCase(verifyOtp.rejected, state => {
        localStorage.clear();
        state.isLoggedIn = false;
        state.user = null;
        state.loading = false;
      })

      .addCase(logoutUser.fulfilled, state => {
        localStorage.clear();
        state.user = null;
        state.isLoggedIn = false;
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
