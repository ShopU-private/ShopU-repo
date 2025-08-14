/* import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q");

    if(!query){
        return NextResponse.json({error: "Missing query"}, {status:400});
    }

    const apikey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&components=country:in&key=${apikey}`;

    try{
        const res = await fetch(url)
        const data = await res.json();
        return NextResponse.json(data);
    }catch(error){
        return NextResponse.json({error: "Failed to fetch"}, {status:500})
    }
} */