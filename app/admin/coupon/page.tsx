"use client";
import { useEffect, useState } from "react";
import AddCouponForm from "./addCoupon";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchCoupons = async () => {
    const res = await fetch("/api/coupons");
    const data = await res.json();
    setCoupons(data);
  };

  const deleteCoupon = async (id: string) => {
    const res = await fetch(`/api/coupons/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchCoupons(); // Refresh the list
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  return (
    <div className="p-6">
      {/* Header with Add Coupon button aligned to right */}
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Coupon
        </button>
      </div>

      {showForm && <AddCouponForm onSuccess={() => { fetchCoupons(); setShowForm(false); }} />}

      {/* Table with updated styling to match the design */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left p-3 font-medium text-gray-600">Name</th>
              <th className="text-left p-3 font-medium text-gray-600">Code</th>
              <th className="text-left p-3 font-medium text-gray-600">Discount</th>
              <th className="text-left p-3 font-medium text-gray-600">Max Usage</th>
              <th className="text-left p-3 font-medium text-gray-600">Expiry</th>
              <th className="text-left p-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c: any) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.code}</td>
                <td className="p-3">{c.discount}%</td>
                <td className="p-3">{c.maxUsage}</td>
                <td className="p-3">{new Date(c.expiryDate).toLocaleDateString()}</td>
                <td className="p-3">
                  <button
                    onClick={() => deleteCoupon(c.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}