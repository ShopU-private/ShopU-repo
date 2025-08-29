import { NextResponse } from "next/server";
import {prisma} from "@/lib/client";

export async function POST(req: Request) {
  try {
    const { name, code, discount, maxUsage, expiryDate } = await req.json();
    const coupon = await prisma.coupon.create({
      data: { name, code, discount, maxUsage, expiryDate: new Date(expiryDate) }
    });
    return NextResponse.json(coupon, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}

export async function GET() {
  const coupons = await prisma.coupon.findMany({ orderBy: { id: "desc" } });
  return NextResponse.json(coupons);
}
