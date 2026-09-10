import { NextRequest, NextResponse } from "next/server";
import { fetchDomesticEpcForPostcode } from "@/lib/providers/epc/epcApiClient";

/**
 * Server-side proxy to MHCLG's Get Energy Performance Data API. Keeps the Bearer token
 * (EPC_API_TOKEN) out of the browser entirely — the client-side RealEpcProvider only ever
 * talks to this route.
 */
export async function GET(request: NextRequest) {
  const postcode = request.nextUrl.searchParams.get("postcode");
  if (!postcode) {
    return NextResponse.json({ error: "postcode query parameter is required" }, { status: 400 });
  }

  const token = process.env.EPC_API_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "EPC_API_TOKEN is not configured" }, { status: 503 });
  }

  try {
    const certificate = await fetchDomesticEpcForPostcode(postcode, token);
    return NextResponse.json({ certificate });
  } catch (err) {
    console.error("EPC lookup failed", err);
    return NextResponse.json({ error: "EPC lookup failed" }, { status: 502 });
  }
}
