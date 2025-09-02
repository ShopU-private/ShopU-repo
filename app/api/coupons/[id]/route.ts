import { NextResponse } from "next/server";
import { prisma } from "@/lib/client";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const coupon = await prisma.coupon.findUnique({ where: { id: Number(id) } });
    if (!coupon) return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    if (coupon.usedCount >= coupon.maxUsage)
      return NextResponse.json({ error: "Usage limit exceeded" }, { status: 400 });

    // Increment usage count
    const updated = await prisma.coupon.update({
      where: { id: Number(id) },
      data: { usedCount: { increment: 1 } },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update coupon usage" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.coupon.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}