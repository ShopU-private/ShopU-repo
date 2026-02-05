import { VerifyOtpData } from '@/types/types';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

export const verifyOtp = createAsyncThunk('/api/verify-otp', async (data: VerifyOtpData, { rejectWithValue }) => {
  try {
    const promise = axios.post('/api/auth/login/verify-otp', data, {
      withCredentials: true
    });

    const message = (await promise).data.message;

    toast.promise(promise, {
      loading: 'Verifying the OTP...',
      success: message,
      error: message
    });

    const response = await promise
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data?.message || 'Failed to verify OTP';
      toast.error(errorData);
      return rejectWithValue(errorData);
    }
    const errorData = `An error occured: ${error}`;
    toast.error(errorData);
    return rejectWithValue(errorData);
  }
});

export const logoutUser = createAsyncThunk('/auth/logout', async (_, { rejectWithValue }) => {
  try {
    const promise = axios.get('/api/account/logout');
    const message = (await promise).data.message;

    toast.promise(promise, {
      loading: 'Logging out user...',
      success: message,
      error: message
    })

    const response = await promise;
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data?.message || 'Failed to logout user';
      toast.error(errorData);
      return rejectWithValue(error);
    }
    const errorData = `An error occured: ${error}`;
    toast.error(errorData);
    return rejectWithValue(errorData);
  }
});

export const checkAuthStatus = createAsyncThunk('/auth/check-status', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/account/me', {
      withCredentials: true
    });
    // Handle the actual response format from /api/account/me
    // Response: { success: true, user: { id, name, email, phoneNumber, role, isProfileComplete } }
    if (response.data.success && response.data.user) {
      return {
        loggedIn: true,
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        phoneNumber: response.data.user.phoneNumber,
        role: response.data.user.role,
        userDetails: response.data.user
      };
    }
    // If not logged in, return loggedIn: false instead of error
    return {
      loggedIn: false,
      userDetails: null
    };
  } catch (error) {
    // Not an error if user is just not logged in (401)
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return {
        loggedIn: false,
        userDetails: null
      };
    }
    return rejectWithValue('Failed to check auth status');
  }
});

export interface AuthState {
  loading: boolean;
  user: unknown;
  isLoggedIn: boolean;
  error: string | null
}


const initialState: AuthState = {
  loading: false,
  user: null,
  isLoggedIn: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.loading = false;
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
    }
  },
  extraReducers: (builders) => {
    builders
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        // action.payload = { success, message, user: { id, phoneNumber, role } }
        if (action.payload.user) {
          state.user = {
            id: action.payload.user.id,
            phoneNumber: action.payload.user.phoneNumber,
            role: action.payload.user.role,
            name: action.payload.user.name || '',
            email: action.payload.user.email || ''
          };
          state.isLoggedIn = true;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.user = null;
        state.error = (action.payload as string) || 'Failed to verify the OTP';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.error = null;
        state.isLoggedIn = false;
        state.loading = false;
        state.user = null;
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        // action.payload = { loggedIn, id?, name?, email?, phoneNumber?, role?, userDetails? }
        if (action.payload.loggedIn) {
          state.isLoggedIn = true;
          state.user = {
            id: action.payload.id,
            name: action.payload.name,
            email: action.payload.email,
            phoneNumber: action.payload.phoneNumber,
            role: action.payload.role,
          };
        } else {
          state.isLoggedIn = false;
          state.user = null;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.loading = false;
      })
  }
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;