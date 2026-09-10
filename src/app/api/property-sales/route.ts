import { NextRequest, NextResponse } from "next/server";
import { fetchSalesForPostcode } from "@/lib/providers/hmlr/hmlrApiClient";

/**
 * Server-side proxy to HM Land Registry's Price Paid Data Linked Data API. No credential to
 * protect here (the API is unauthenticated) — this route exists to avoid browser CORS issues and
 * keep the upstream URL/shape out of client code.
 */
export async function GET(request: NextRequest) {
  const postcode = request.nextUrl.searchParams.get("postcode");
  if (!postcode) {
    return NextResponse.json({ error: "postcode query parameter is required" }, { status: 400 });
  }

  try {
    const sales = await fetchSalesForPostcode(postcode);
    return NextResponse.json({ sales });
  } catch (err) {
    console.error("HM Land Registry lookup failed", err);
    return NextResponse.json({ error: "HM Land Registry lookup failed" }, { status: 502 });
  }
}
