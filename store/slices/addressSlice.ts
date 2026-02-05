import { AddressState } from '@/types/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Address } from 'cluster';
import toast from 'react-hot-toast';

// Fetch all addresses
export const fetchAddresses = createAsyncThunk(
  'address/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const promise = axios.get('/api/account/address', {
        withCredentials: true,
      });
      const message = (await promise).data.message

      toast.promise(promise, {
        loading: 'Fetching the address...',
        success: message,
        error: message
      })

      const res = await promise;
      return res.data.address
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to fetch addresses');
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch addresses');
      }
      toast.error('An error occurred');
      return rejectWithValue('An error occurred');
    }
  }
);

// Add new address
export const addAddress = createAsyncThunk(
  'address/addAddress',
  async (address: Address, { rejectWithValue }) => {
    try {
      const promise = axios.post('/api/account/address', address, {
        withCredentials: true,
      });
      const message = (await promise).data.message

      toast.promise(promise, {
        loading: 'Adding address...',
        success: message,
        error: message,
      });

      const res = await promise;
      return res.data.newAddress;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add address');
      }
      return rejectWithValue('An error occurred');
    }
  }
);

// Update address
export const updateAddress = createAsyncThunk(
  'address/updateAddress',
  async ({ id, address }: { id: string; address: Address }, { rejectWithValue }) => {
    try {
      const promise = axios.patch(`/api/account/address/${id}`, address, {
        withCredentials: true,
      });
      const message = (await promise).data.message;

      toast.promise(promise, {
        loading: 'Updating address...',
        success: message,
        error: message,
      });

      const res = await promise;
      return res.data.updatedAddress;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update address');
      }
      return rejectWithValue('An error occurred');
    }
  }
);

// Delete address
export const deleteAddress = createAsyncThunk(
  'address/deleteAddress',
  async (id: string, { rejectWithValue }) => {
    try {
      const promise = axios.delete(`/api/account/address/${id}`, {
        withCredentials: true,
      });
      const message = (await promise).data.message;

      toast.promise(promise, {
        loading: 'Deleting address...',
        success: message,
        error: message,
      });

      await promise;
      return id;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete address');
      }
      return rejectWithValue('An error occurred');
    }
  }
);

// Initialize state from localStorage if available
const getInitialState = (): AddressState => {
  if (typeof window !== 'undefined') {
    const savedAddressId = localStorage.getItem('selectedAddressId');
    return {
      addresses: [],
      selectedAddressId: savedAddressId || null,
      loading: false,
      error: null,
    };
  }

  return {
    addresses: [],
    selectedAddressId: null,
    loading: false,
    error: null,
  };
};

const initialState: AddressState = getInitialState();

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setSelectedAddress: (state, action: PayloadAction<string | null>) => {
      state.selectedAddressId = action.payload;
      if (typeof window !== 'undefined' && action.payload) {
        localStorage.setItem('selectedAddressId', action.payload);
      } else if (typeof window !== 'undefined') {
        localStorage.removeItem('selectedAddressId');
      }
    },
    clearAddresses: state => {
      state.addresses = [];
      state.selectedAddressId = null;
      state.loading = false;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('selectedAddressId');
      }
    },
  },
  extraReducers: builder => {
    builder
      // Fetch addresses
      .addCase(fetchAddresses.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add address
      .addCase(addAddress.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload);
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update address
      .addCase(updateAddress.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete address
      .addCase(deleteAddress.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
        if (state.selectedAddressId === action.payload) {
          state.selectedAddressId = null;
          if (typeof window !== 'undefined') {
            localStorage.removeItem('selectedAddressId');
          }
        }
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedAddress, clearAddresses } = addressSlice.actions;
export default addressSlice.reducer;
