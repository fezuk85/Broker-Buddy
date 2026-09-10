import { NextRequest, NextResponse } from "next/server";
import { fetchPostcodeGeography } from "@/lib/providers/onspd/onspdApiClient";

/**
 * Server-side proxy to ONS Geography's live Postcode Directory query service. No credential to
 * protect — exists to avoid browser CORS issues and keep the upstream URL/shape out of client
 * code, matching the pattern used for /api/property-sales.
 */
export async function GET(request: NextRequest) {
  const postcode = request.nextUrl.searchParams.get("postcode");
  if (!postcode) {
    return NextResponse.json({ error: "postcode query parameter is required" }, { status: 400 });
  }

  try {
    const geography = await fetchPostcodeGeography(postcode);
    return NextResponse.json({ geography });
  } catch (err) {
    console.error("ONS Postcode Directory lookup failed", err);
    return NextResponse.json({ error: "Postcode geography lookup failed" }, { status: 502 });
  }
}
