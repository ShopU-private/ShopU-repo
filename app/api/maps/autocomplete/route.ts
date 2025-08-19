import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_OLA_MAPS_API_KEY;
  const url = `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(
    query
  )}&api_key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Ola API error:", error);
    return NextResponse.json({ error: "Failed to fetch autocomplete" }, { status: 500 });
  }
}