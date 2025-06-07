import { NextRequest, NextResponse } from "next/server";
import {prisma }from "@/lib/client";
import { isAdmin } from "@/lib/auth";

export async function POST(request: NextRequest) {
    if (!isAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  const { value, variantTypeId } = await request.json();

  if (!value || !variantTypeId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const variantValue = await prisma.variantValue.create({
    data: {
      value,
      variantTypeId,
    },
  });

  return NextResponse.json(variantValue);
}
export async function GET(request: NextRequest) {
    if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const variantValues = await prisma.variantValue.findMany({
      include: {
        variantType: true, // optional: include related VariantType data
      },
    });

    return NextResponse.json(variantValues);
  } catch (error: unknown) {
    let message = "Unknown error";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      { error: "Failed to fetch variant values", details: message },
      { status: 500 }
    );
  }
}
