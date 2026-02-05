import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import addressReducer from './slices/addressSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    address: addressReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
