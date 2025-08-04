"use client";

import { useState, useEffect } from "react";
import AddAddress from "@/app/components/AddAddress"; // path sahi rakhna
import { UserAddress } from "@prisma/client"; // ya jo bhi type hai

export default function AddressPage() {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [showForm, setShowForm] = useState(false);

  const fetchAddresses = async () => {
    const res = await fetch("/api/addresses");
    const data = await res.json();
    setAddresses(data);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSave = (newAddress: UserAddress) => {
    setAddresses((prev) => [...prev, newAddress]);
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Addresses</h2>

      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Another Address
      </button>

      <div className="mt-6 space-y-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="border rounded-lg p-4 shadow-sm bg-gray-50"
          >
            <p><strong>{addr.fullName}</strong></p>
            <p>{addr.addressLine1}, {addr.city}, {addr.state}</p>
            <p>{addr.country} - {addr.postalCode}</p>
            <p>Phone: {addr.phoneNumber}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <AddAddress
          onCancel={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}