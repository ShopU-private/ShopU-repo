export interface AuthState {
  loading: boolean;
  user: unknown;
  isLoggedIn: boolean;
  error: string | null
}

export interface Address {
  id?: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

export interface VerifyOtpData {
  phoneNumber: string;
  otp: string;
}

interface AddressState {
  addresses: Address[];
  selectedAddressId: string | null;
  loading: boolean;
  error: string | null;
}
