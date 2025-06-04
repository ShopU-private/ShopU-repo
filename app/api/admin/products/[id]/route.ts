// app/api/admin/products/[id]/route.ts

import { verifyAdmin } from "@/lib/auth";
import { prisma } from "@/lib/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function DELETE(request: Request, context: { params: { id: string } }) {
  const { params } = context;

  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;
  
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: number;
        role: string;
      };
  
      if (decoded.role !== "admin") {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }

    await prisma.product.delete({
      where: {
        id: Number(params.id),
      },
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;
  
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: number;
        role: string;
      };
  
      if (decoded.role !== "admin") {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }


  const body = await req.json();

  const updated = await prisma.product.update({
    where: { id: Number(params.id )},
    data: body,
  });

  return NextResponse.json(updated);
}
catch (err) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }
}
