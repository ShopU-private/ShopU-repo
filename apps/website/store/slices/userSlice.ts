import { ShopUError } from "@/proxy/ShopUError";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

export interface UserDetails {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
}

interface UserState {
  userDetails: UserDetails | null;
  loading: boolean;
  error: string | null;
}

export const getUserDetails = createAsyncThunk('/account/me', async () => {
  try {
    const promise = axios.get('/api/account/me', {
      withCredentials: true
    });
    const message = (await promise).data.message;

    toast.promise(promise, {
      loading: 'Fetching account details',
      success: message,
      error: message
    })

    const response = await promise;
    return response.data.userDetails;
  } catch (error) {
    toast.error(String(error))
    throw new ShopUError(500, String(error))
  }
})

const initialState: UserState = {
  userDetails: null,
  loading: false,
  error: null
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserDetails: (state) => {
      state.userDetails = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUserDetails.fulfilled,
        (state, action: PayloadAction<UserDetails>) => {
          state.loading = false;
          state.userDetails = action.payload;
        }
      )
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.userDetails = null;
        state.error = action.error.message || "Error";
      });
  },
});

export const { clearUserDetails } = userSlice.actions;
export default userSlice.reducer;
