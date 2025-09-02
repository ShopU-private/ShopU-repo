"use client";
import { useState } from "react";

export default function AddCouponForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({ name: "", code: "", discount: "", maxUsage: "", expiryDate: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        discount: Number(form.discount),
        maxUsage: Number(form.maxUsage)
      })
    });
    if (res.ok) {
      setForm({ name: "", code: "", discount: "", maxUsage: "", expiryDate: "" });
      onSuccess();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 border">
      <h3 className="text-lg font-medium mb-4">Add New Coupon</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <input 
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="Coupon Name" 
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })} 
          required 
        />
        <input 
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="Coupon Code" 
          value={form.code}
          onChange={e => setForm({ ...form, code: e.target.value })} 
          required 
        />
        <input 
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="Discount %" 
          type="number" 
          value={form.discount}
          onChange={e => setForm({ ...form, discount: e.target.value })} 
          required 
        />
        <input 
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="Max Usage" 
          type="number" 
          value={form.maxUsage}
          onChange={e => setForm({ ...form, maxUsage: e.target.value })} 
          required 
        />
        <input 
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
          type="date" 
          value={form.expiryDate}
          onChange={e => setForm({ ...form, expiryDate: e.target.value })} 
          required 
        />
        <div className="md:col-span-5 flex gap-2">
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Coupon
          </button>
          <button 
            type="button"
            onClick={() => onSuccess()}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}