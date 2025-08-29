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
    <form onSubmit={handleSubmit} className="p-4 space-y-3">
      <input className="border p-2 w-full" placeholder="Coupon Name" value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })} required />
      <input className="border p-2 w-full" placeholder="Coupon Code" value={form.code}
        onChange={e => setForm({ ...form, code: e.target.value })} required />
      <input className="border p-2 w-full" placeholder="Discount %" type="number" value={form.discount}
        onChange={e => setForm({ ...form, discount: e.target.value })} required />
      <input className="border p-2 w-full" placeholder="Max Usage" type="number" value={form.maxUsage}
        onChange={e => setForm({ ...form, maxUsage: e.target.value })} required />
      <input className="border p-2 w-full" type="date" value={form.expiryDate}
        onChange={e => setForm({ ...form, expiryDate: e.target.value })} required />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Create Coupon</button>
    </form>
  );
}
