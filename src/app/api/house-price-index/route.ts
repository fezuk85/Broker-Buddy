import { NextRequest, NextResponse } from "next/server";
import { fetchPostcodeGeography } from "@/lib/providers/onspd/onspdApiClient";
import { getIndexMovement } from "@/lib/providers/ukhpi/ukhpiClient";

/**
 * Joins postcode -> local authority (ONS Postcode Directory) with HM Land Registry's UK HPI
 * local-authority index to give the real percentage price movement for that area since a given
 * date (typically a property's last recorded sale). England & Wales only.
 */
export async function GET(request: NextRequest) {
  const postcode = request.nextUrl.searchParams.get("postcode");
  const sinceDate = request.nextUrl.searchParams.get("sinceDate");
  if (!postcode || !sinceDate) {
    return NextResponse.json({ error: "postcode and sinceDate query parameters are required" }, { status: 400 });
  }

  try {
    const geography = await fetchPostcodeGeography(postcode);
    if (!geography) {
      return NextResponse.json({ movement: null, reason: "postcode-not-found" });
    }

    const movement = getIndexMovement(geography.localAuthorityCode, sinceDate);
    if (!movement) {
      return NextResponse.json({ movement: null, reason: "no-index-data-for-authority" });
    }

    return NextResponse.json({ movement });
  } catch (err) {
    console.error("UK HPI lookup failed", err);
    return NextResponse.json({ error: "UK HPI lookup failed" }, { status: 502 });
  }
}
