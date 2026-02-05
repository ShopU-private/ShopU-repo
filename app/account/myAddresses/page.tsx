'use client';

import { useEffect, Suspense, useState } from 'react';
import AddAddress from '@/app/components/AddAddress';
import Navroute from '@/app/components/Navroute';
import { Edit, Home, Loader, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/store/redux/hook';
import {
  fetchAddresses,
  deleteAddress,
  addAddress,
  updateAddress,
} from '@/store/slices/addressSlice';
import { Address } from '@/types/types';

export default function AddressPage() {
  const dispatch = useAppDispatch();
  const { addresses, loading } = useAppSelector(state => state.address);

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleSave = async (addressData: Address) => {
    try {
      if (editingAddress?.id) {
        // Update existing address
        await dispatch(
          updateAddress({
            id: editingAddress.id,
            address: addressData,
          })
        ).unwrap();
      } else {
        // Add new address
        await dispatch(addAddress(addressData)).unwrap();
      }
      // Close form and reset editing state on success
      setShowForm(false);
      setEditingAddress(null);
    } catch (error) {
      console.error('Error saving address:', error);
      // Keep form open on error so user can retry
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDelete = async (addressId: string) => {
    if (!addressId) return;

    try {
      setDeletingId(addressId);
      await dispatch(deleteAddress(addressId)).unwrap();
    } catch (error) {
      console.error('Error deleting address:', error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navroute />
      <div className="min-h-screen px-4 py-6">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <h2 className="text-primaryColor mb-4 text-lg font-semibold sm:mb-6 sm:text-xl">
            My <span className="text-secondaryColor">Addresses</span>
            <hr className="bg-background1 mt-1 w-32 rounded border-2" />
          </h2>

          {/* Add New Address */}
          <button
            onClick={() => {
              if (addresses.length >= 3) {
                toast.error('You can only save up to 3 addresses.');
                return;
              }
              setEditingAddress(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 text-sm font-medium text-green-700 hover:underline disabled:opacity-50"
            disabled={addresses.length >= 3}
          >
            <Plus className="h-4 w-4" />
            Add new address
          </button>

          {loading ? (
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="text-center">
                <Loader className="mx-auto h-8 w-8 animate-spin text-teal-600" />
                <p className="mt-4 text-gray-600">Loading your addresses...</p>
              </div>
            </div>
          ) : addresses.length === 0 ? (
            <div className="min-h-[60vh] text-center text-gray-500">
              No addresses found. Add your first address to get started.
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {/* Address Cards */}
              {addresses.map(addr => (
                <div
                  key={addr.id}
                  className="flex items-center justify-between gap-6 rounded-md bg-white px-6 py-4 shadow-sm shadow-gray-300"
                >
                  <div className="flex items-center gap-5 text-gray-800">
                    <div>
                      <Home className="text-primaryColor" />
                    </div>
                    <div className="text-md">
                      <span className="font-medium">{addr.fullName}</span>
                      <br />
                      <span className="text-sm text-gray-600">
                        {addr.addressLine1}
                        {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}, {addr.city},{' '}
                        {addr.state}, {addr.country} {addr.postalCode}
                      </span>
                      <br />
                      <span className="text-sm text-gray-600">Phone: +91 {addr.phoneNumber}</span>
                      {addr.latitude && addr.longitude && (
                        <span className="mt-1 block text-xs text-gray-400">
                          📍 Lat: {addr.latitude.toFixed(4)}, Lng: {addr.longitude.toFixed(4)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                    <button
                      onClick={() => handleEdit(addr)}
                      className="cursor-pointer text-sm text-blue-600 hover:text-blue-700"
                      title="Edit address"
                    >
                      <Edit className="h-5 w-5 text-gray-500 hover:text-blue-600" />
                    </button>

                    <button
                      onClick={() => handleDelete(addr.id!)}
                      className="cursor-pointer text-gray-500 hover:text-red-500 disabled:opacity-60"
                      disabled={deletingId === addr.id}
                      title="Delete address"
                    >
                      {deletingId === addr.id ? (
                        <Loader className="h-5 w-5 animate-spin text-red-500" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <AddAddress
          formMode={editingAddress ? 'edit' : 'add'}
          initialData={editingAddress}
          onCancel={() => {
            setShowForm(false);
            setEditingAddress(null);
          }}
          onSave={handleSave}
        />
      )}
    </Suspense>
  );
}
