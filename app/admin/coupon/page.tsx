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

  useEffect(() => { fetchCoupons(); }, []);

  return (
    <div className="p-6">
      <button onClick={() => setShowForm(!showForm)} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
        Add Coupon
      </button>
      {showForm && <AddCouponForm onSuccess={() => { fetchCoupons(); setShowForm(false); }} />}

      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Code</th>
            <th className="border p-2">Discount</th>
            <th className="border p-2">Max Usage</th>
            <th className="border p-2">Expiry</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((c: any) => (
            <tr key={c.id}>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.code}</td>
              <td className="border p-2">{c.discount}%</td>
              <td className="border p-2">{c.maxUsage}</td>
              <td className="border p-2">{new Date(c.expiryDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
