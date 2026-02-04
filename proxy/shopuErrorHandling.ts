import { NextResponse } from "next/server";
import { ShopUError } from "./ShopUError";

export function shopuErrorHandler(err: unknown) {
  if (err instanceof ShopUError) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: err.statusCode }
    )
  }

  return NextResponse.json(
    { success: false, message: `Internal server error: ${err}` },
    { status: 500 }
  )
}