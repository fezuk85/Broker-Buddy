import { describe, it, expect, vi } from "vitest";
import { fetchPostcodeGeography } from "./onspdApiClient";

// Sample shape taken from a real request against the live ONS Postcode Directory query service.
const SAMPLE_POSTCODE_RESPONSE = {
  features: [
    {
      attributes: {
        PCDS: "DE23 8PL",
        LAD25CD: "E06000015",
        LSOA21CD: "E01013567",
        LSOA11CD: "E01013567",
        LAT: 52.90237,
        LONG: -1.476892,
        DOTERM: null,
      },
    },
  ],
};

const SAMPLE_LAD_NAME_RESPONSE = {
  features: [{ attributes: { LAD25CD: "E06000015", LAD25NM: "Derby" } }],
};

function mockFetchSequence(responses: Array<{ status: number; body?: unknown }>) {
  let call = 0;
  return vi.fn(async (..._args: Parameters<typeof fetch>) => {
    void _args;
    const r = responses[call++];
    return { ok: r.status >= 200 && r.status < 300, status: r.status, json: async () => r.body } as Response;
  });
}

describe("fetchPostcodeGeography", () => {
  it("resolves a postcode to its local authority and LSOA via the two-step lookup", async () => {
    const fetchImpl = mockFetchSequence([
      { status: 200, body: SAMPLE_POSTCODE_RESPONSE },
      { status: 200, body: SAMPLE_LAD_NAME_RESPONSE },
    ]);

    const result = await fetchPostcodeGeography("de23 8pl", fetchImpl);

    expect(result).toEqual({
      postcode: "DE23 8PL",
      localAuthorityCode: "E06000015",
      localAuthorityName: "Derby",
      lsoa2021Code: "E01013567",
      lsoa2011Code: "E01013567",
      terminated: false,
    });
  });

  it("normalizes the postcode into the standard spaced form before querying", async () => {
    const fetchImpl = mockFetchSequence([
      { status: 200, body: SAMPLE_POSTCODE_RESPONSE },
      { status: 200, body: SAMPLE_LAD_NAME_RESPONSE },
    ]);
    await fetchPostcodeGeography("DE238PL", fetchImpl);
    const url = fetchImpl.mock.calls[0][0] as string;
    expect(url).toContain("PCDS%3D%27DE23+8PL%27");
  });

  it("flags a terminated postcode via the DOTERM field", async () => {
    const fetchImpl = mockFetchSequence([
      { status: 200, body: { features: [{ attributes: { ...SAMPLE_POSTCODE_RESPONSE.features[0].attributes, DOTERM: "202401" } }] } },
      { status: 200, body: SAMPLE_LAD_NAME_RESPONSE },
    ]);
    const result = await fetchPostcodeGeography("DE23 8PL", fetchImpl);
    expect(result?.terminated).toBe(true);
  });

  it("returns null when the postcode has no match", async () => {
    const fetchImpl = mockFetchSequence([{ status: 200, body: { features: [] } }]);
    const result = await fetchPostcodeGeography("ZZ1 1AA", fetchImpl);
    expect(result).toBeNull();
  });

  it("returns null when the local authority name can't be resolved", async () => {
    const fetchImpl = mockFetchSequence([
      { status: 200, body: SAMPLE_POSTCODE_RESPONSE },
      { status: 200, body: { features: [] } },
    ]);
    const result = await fetchPostcodeGeography("DE23 8PL", fetchImpl);
    expect(result).toBeNull();
  });

  it("throws on a non-ok response status from the postcode query", async () => {
    const fetchImpl = mockFetchSequence([{ status: 500 }]);
    await expect(fetchPostcodeGeography("DE23 8PL", fetchImpl)).rejects.toThrow();
  });
});
