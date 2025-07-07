// app/contact/page.tsx
"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/faq", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setResponse(data.success ? "Message sent!" : "Failed to send.");
    setLoading(false);
    setForm({ name: "", subject: "", message: "" });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-16 max-w-6xl mx-auto">
        
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">General Information</h2>
        <div className="space-y-4 text-gray-700">
          <div>
            <h4 className="font-semibold">What can I buy from Shop U Store?</h4>
            <p>
              Prescription medicines, OTC healthcare products, and daily essentials.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">How fast is the delivery?</h4>
            <p>10–30 minutes for groceries, same-day for medicines.</p>
          </div>
          <div>
            <h4 className="font-semibold">What payment methods do you accept?</h4>
            <p>UPI, cards, net banking, COD, wallets, etc.</p>
          </div>
          <div>
            <h4 className="font-semibold">Can I return items?</h4>
            <p>
              Groceries/medicines are non-returnable unless wrong/damaged.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">How do I contact support?</h4>
            <p>Use the chat icon or call us at 1800-123-4567 (8 AM - 10 PM).</p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-200 p-6 rounded-md w-full max-w-md"
      >
        <h2 className="text-lg font-semibold mb-4">Ask a Question</h2>
        <input
          type="text"
          required
          placeholder="Your Name"
          className="w-full p-2 mb-3 rounded-md"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          required
          placeholder="Subject"
          className="w-full p-2 mb-3 rounded-md"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />
        <textarea
          required
          placeholder="Tag Your Message"
          className="w-full p-2 mb-3 rounded-md h-24"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        <button
          type="submit"
          className="bg-gray-700 text-white px-4 py-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
        {response && <p className="mt-2 text-sm">{response}</p>}
      </form>
      
    </div>

  );
}
