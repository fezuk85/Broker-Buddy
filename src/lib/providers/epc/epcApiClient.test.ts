import { describe, it, expect, vi } from "vitest";
import { fetchDomesticEpcForPostcode, mapDomesticCertificate } from "./epcApiClient";

// Sample shapes taken from MHCLG's official documentation/JSON samples.
const SAMPLE_SEARCH_RESPONSE = {
  data: [
    {
      certificateNumber: "1111-2222-3333-4444-5555",
      registrationDate: "2021-08-11",
      currentEnergyEfficiencyBand: "D",
      schemaType: "RdSAP-Schema-20.0.0",
    },
    {
      certificateNumber: "9999-8888-7777-6666-5555",
      registrationDate: "2023-01-05",
      currentEnergyEfficiencyBand: "C",
      schemaType: "RdSAP-Schema-21.0.1",
    },
  ],
};

const SAMPLE_CERTIFICATE_RESPONSE = {
  data: {
    current_energy_efficiency_band: "E",
    energy_rating_current: 50,
    potential_energy_efficiency_band: "C",
    energy_rating_potential: 72,
    total_floor_area: 55,
    dwelling_type: "Mid-terrace house",
    inspection_date: "2025-04-04",
    registration_date: "2025-04-10",
    sap_building_parts: [{ construction_age_band: "M" }],
    main_heating: [
      { description: { value: "Boiler and radiators, anthracite" } },
      { description: { value: "Boiler and radiators, mains gas" } },
    ],
  },
};

function mockFetchSequence(responses: Array<{ status: number; body?: unknown }>) {
  let call = 0;
  return vi.fn(async (..._args: Parameters<typeof fetch>) => {
    void _args;
    const r = responses[call++];
    return {
      ok: r.status >= 200 && r.status < 300,
      status: r.status,
      json: async () => r.body,
    } as Response;
  });
}

describe("mapDomesticCertificate", () => {
  it("maps the documented sample fields correctly", () => {
    const result = mapDomesticCertificate(SAMPLE_CERTIFICATE_RESPONSE.data);
    expect(result).toEqual({
      currentRating: "E",
      potentialRating: "C",
      certificateDate: "2025-04-04",
      totalFloorAreaSqm: 55,
      propertyType: "Mid-terrace house",
      constructionAgeBand: "M",
      mainHeatingType: "Boiler and radiators, anthracite",
      currentEnergyEfficiencyScore: 50,
      potentialEnergyEfficiencyScore: 72,
    });
  });

  it("falls back to registration_date when inspection_date is missing", () => {
    const result = mapDomesticCertificate({ ...SAMPLE_CERTIFICATE_RESPONSE.data, inspection_date: undefined });
    expect(result?.certificateDate).toBe("2025-04-10");
  });

  it("returns null when the current rating is missing or invalid", () => {
    expect(mapDomesticCertificate({ ...SAMPLE_CERTIFICATE_RESPONSE.data, current_energy_efficiency_band: undefined })).toBeNull();
    expect(mapDomesticCertificate({ ...SAMPLE_CERTIFICATE_RESPONSE.data, current_energy_efficiency_band: "Z" })).toBeNull();
  });

  it("returns null when both dates are missing", () => {
    const result = mapDomesticCertificate({
      ...SAMPLE_CERTIFICATE_RESPONSE.data,
      inspection_date: undefined,
      registration_date: undefined,
    });
    expect(result).toBeNull();
  });

  it("handles missing optional nested fields without throwing", () => {
    const result = mapDomesticCertificate({
      current_energy_efficiency_band: "D",
      potential_energy_efficiency_band: "B",
      inspection_date: "2024-01-01",
    });
    expect(result?.constructionAgeBand).toBeUndefined();
    expect(result?.mainHeatingType).toBeUndefined();
    expect(result?.totalFloorAreaSqm).toBe(0);
  });
});

describe("fetchDomesticEpcForPostcode", () => {
  it("performs the two-step search-then-certificate flow and picks the most recent result", async () => {
    const fetchImpl = mockFetchSequence([
      { status: 200, body: SAMPLE_SEARCH_RESPONSE },
      { status: 200, body: SAMPLE_CERTIFICATE_RESPONSE },
    ]);

    const result = await fetchDomesticEpcForPostcode("LS1 4AP", "test-token", fetchImpl);

    expect(result?.currentRating).toBe("E");
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    const searchUrl = fetchImpl.mock.calls[0][0] as string;
    expect(searchUrl).toContain("/api/domestic/search");
    expect(searchUrl).toContain("postcode=LS1");
    const certUrl = fetchImpl.mock.calls[1][0] as string;
    expect(certUrl).toContain("certificate_number=9999-8888-7777-6666-5555"); // the more recent of the two
  });

  it("sends the Bearer token and Accept header", async () => {
    const fetchImpl = mockFetchSequence([
      { status: 200, body: { data: [] } },
    ]);
    await fetchDomesticEpcForPostcode("LS1 4AP", "test-token", fetchImpl);
    const [, options] = fetchImpl.mock.calls[0];
    expect((options as RequestInit).headers).toMatchObject({
      Authorization: "Bearer test-token",
      Accept: "application/json",
    });
  });

  it("returns null when the search returns 404 (no matches)", async () => {
    const fetchImpl = mockFetchSequence([{ status: 404 }]);
    const result = await fetchDomesticEpcForPostcode("ZZ1 1AA", "test-token", fetchImpl);
    expect(result).toBeNull();
  });

  it("returns null when the search returns an empty data array", async () => {
    const fetchImpl = mockFetchSequence([{ status: 200, body: { data: [] } }]);
    const result = await fetchDomesticEpcForPostcode("LS1 4AP", "test-token", fetchImpl);
    expect(result).toBeNull();
  });

  it("throws on a non-404 error status from search", async () => {
    const fetchImpl = mockFetchSequence([{ status: 500 }]);
    await expect(fetchDomesticEpcForPostcode("LS1 4AP", "test-token", fetchImpl)).rejects.toThrow();
  });

  it("throws on an error status from the certificate fetch", async () => {
    const fetchImpl = mockFetchSequence([{ status: 200, body: SAMPLE_SEARCH_RESPONSE }, { status: 500 }]);
    await expect(fetchDomesticEpcForPostcode("LS1 4AP", "test-token", fetchImpl)).rejects.toThrow();
  });
});
