import { NextRequest, NextResponse } from "next/server";
import { fetchPostcodeGeography } from "@/lib/providers/onspd/onspdApiClient";
import { getChargesForAuthority } from "@/lib/providers/councilTax/table9Client";
import { getAreaTypicalBand } from "@/lib/providers/councilTax/ctsop11Client";

export interface CouncilTaxEstimateResponse {
  localAuthority: string;
  band: string;
  annualChargeGbp: number;
  /** True: the band shown is the area's most common band (illustrative), not confirmed for this property. */
  bandIsAreaTypical: true;
}

/**
 * Joins postcode -> local authority/LSOA (ONS Postcode Directory) with MHCLG's Table 9 charges
 * and the VOA's CTSOP1.1 area-typical band to produce an illustrative Council Tax estimate with
 * no manual band entry required. The band is never a confirmed value for the specific property —
 * see /data-sources and the response's bandIsAreaTypical flag.
 */
export async function GET(request: NextRequest) {
  const postcode = request.nextUrl.searchParams.get("postcode");
  if (!postcode) {
    return NextResponse.json({ error: "postcode query parameter is required" }, { status: 400 });
  }

  try {
    const geography = await fetchPostcodeGeography(postcode);
    if (!geography) {
      return NextResponse.json({ estimate: null, reason: "postcode-not-found" });
    }

    const areaTypicalBand = geography.lsoa2021Code ? getAreaTypicalBand(geography.lsoa2021Code) : null;
    if (!areaTypicalBand) {
      return NextResponse.json({ estimate: null, reason: "no-area-band-data" });
    }

    const authorityCharges = getChargesForAuthority(geography.localAuthorityCode);
    if (!authorityCharges) {
      return NextResponse.json({ estimate: null, reason: "no-authority-charge-data" });
    }

    const annualChargeGbp = authorityCharges.charges[areaTypicalBand.band];
    if (annualChargeGbp == null) {
      return NextResponse.json({ estimate: null, reason: "no-charge-for-band" });
    }

    const estimate: CouncilTaxEstimateResponse = {
      localAuthority: authorityCharges.authority,
      band: areaTypicalBand.band,
      annualChargeGbp,
      bandIsAreaTypical: true,
    };
    return NextResponse.json({ estimate });
  } catch (err) {
    console.error("Council Tax estimate lookup failed", err);
    return NextResponse.json({ error: "Council Tax estimate lookup failed" }, { status: 502 });
  }
}
