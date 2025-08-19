import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const placeId = searchParams.get("place_id");

  if (!placeId) {
    return NextResponse.json({ error: "Missing place_id" }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_OLA_MAPS_API_KEY;
  const url = `https://api.olamaps.io/places/v1/details?place_id=${placeId}&api_key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Ola API error:", error);
    return NextResponse.json({ error: "Failed to fetch details" }, { status: 500 });
  }
}