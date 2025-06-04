"use client";
import { useState } from "react";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    imageUrl: ""
  });

  const handleSubmit = async (e: any) => {
    
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

if (res.ok) {
  alert(data.message || "Product added!");
} else {
  alert("Failed: " + (data.error || "Unknown error"));
}
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        onChange={(e) =>
          setForm({ ...form, price: parseFloat(e.target.value) })
        }
      />
      <input
        type="number"
        placeholder="Stock"
        onChange={(e) =>
          setForm({ ...form, stock: parseInt(e.target.value) })
        }
      />
      <textarea
        placeholder="Description"
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />
      <input
        placeholder="Image URL"
        onChange={(e) =>
          setForm({ ...form, imageUrl: e.target.value })
        }
      />
      <button type="submit">Add Product</button>
    </form>
  );
}
