"use client";

import { useState, useEffect } from "react";
import AddAddress from "@/app/components/AddAddress";
import { UserAddress } from "@prisma/client";

// Define the Address type to match what AddAddress component expects
type Address = {
  id?: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
};

export default function AddressPage() {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/account/address", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.address || []);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSave = async (addressData: Address) => {
    try {
      if (editingAddress?.id) {
        // Update existing address
        const res = await fetch(`/api/account/address/${editingAddress.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(addressData),
        });
        if (res.ok) {
          fetchAddresses(); // Refresh the list
        }
      } else {
        // Add new address
        const res = await fetch("/api/account/address", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(addressData),
        });
        if (res.ok) {
          fetchAddresses(); // Refresh the list
        }
      }
    } catch (error) {
      console.error("Error saving address:", error);
    }

    setShowForm(false);
    setEditingAddress(null);
  };

  const handleEdit = (address: UserAddress) => {
    const editableAddress: Address = {
      id: address.id,
      fullName: address.fullName,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || undefined,
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
      phoneNumber: address.phoneNumber,
    };
    setEditingAddress(editableAddress);
    setShowForm(true);
  };

  const handleDelete = async (addressId: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      try {
        const res = await fetch(`/api/account/address/${addressId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) {
          fetchAddresses(); // Refresh the list
        }
      } catch (error) {
        console.error("Error deleting address:", error);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Addresses</h2>

      <button
        onClick={() => {
          setEditingAddress(null);
          setShowForm(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add New Address
      </button>

      <div className="mt-6 space-y-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="border rounded-lg p-4 shadow-sm bg-gray-50"
          >
            <p>
              <strong>{addr.fullName}</strong>
            </p>
            <p>
              {addr.addressLine1}
              {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
            </p>
            <p>
              {addr.city}, {addr.state}
            </p>
            <p>
              {addr.country} - {addr.postalCode}
            </p>
            <p>Phone: {addr.phoneNumber}</p>

            <div className="mt-3 space-x-2">
              <button
                onClick={() => handleEdit(addr)}
                className="text-blue-600 hover:underline text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(addr.id)}
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {addresses.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No addresses found. Add your first address to get started.
          </p>
        )}
      </div>

      {showForm && (
        <AddAddress
          formMode={editingAddress ? "edit" : "add"}
          initialData={editingAddress}
          onCancel={() => {
            setShowForm(false);
            setEditingAddress(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}