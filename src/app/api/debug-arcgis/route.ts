import { NextRequest, NextResponse } from "next/server";

/**
 * TEMPORARY diagnostic route — not linked from anywhere in the UI. Exists only to see the raw
 * ArcGIS response in production, since the sandbox this was built in can't reach services1.arcgis.com
 * directly. Delete once the ONS Postcode Directory lookup issue is diagnosed.
 */
export async function GET(request: NextRequest) {
  const postcode = request.nextUrl.searchParams.get("postcode") ?? "SW1A 1AA";
  const layer = request.nextUrl.searchParams.get("layer") ?? "1";
  const mode = request.nextUrl.searchParams.get("mode"); // "schema" to list fields instead of querying
  const base = `https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Online_ONS_Postcode_Directory_Live/FeatureServer/${layer}`;
  const url =
    mode === "schema"
      ? `${base}?f=json`
      : `${base}/query?` +
        new URLSearchParams({ where: `PCDS='${postcode}'`, outFields: "*", f: "json" }).toString();

  try {
    const res = await fetch(url);
    const text = await res.text();
    return NextResponse.json({ requestUrl: url, status: res.status, ok: res.ok, body: text });
  } catch (err) {
    return NextResponse.json({ requestUrl: url, error: String(err) }, { status: 500 });
  }
}
