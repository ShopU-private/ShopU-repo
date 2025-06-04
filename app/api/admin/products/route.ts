// app/api/admin/products/route.ts

import { prisma } from "@/lib/client";
import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth"; // optional
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      role: string;
    };
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { name, price, stock, description, imageUrl } = body;

    const product = await prisma.product.create({
      data: {
        name,
        price,
        stock,
        description,
        imageUrl // assumes 'images' is a string[]
      },
    });

    return NextResponse.json({ success: true, message: "Product created" });
  } catch (err) {
    console.error("Error creating product:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}



export async function GET(req: Request) {
  // const admin = verifyAdmin(req);
  // if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const products = await prisma.product.findMany();
  return NextResponse.json(products);
}


