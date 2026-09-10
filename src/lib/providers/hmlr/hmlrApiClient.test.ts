import { describe, it, expect, vi } from "vitest";
import { fetchSalesForPostcode } from "./hmlrApiClient";

// Sample shape taken from a real request against landregistry.data.gov.uk/data/ppi/transaction-record.json
const SAMPLE_RESPONSE = {
  result: {
    items: [
      {
        _about: "http://landregistry.data.gov.uk/data/ppi/transaction/25E9DA80-AFA5-555E-E063-4704A8C066F2/current",
        estateType: {
          _about: "http://landregistry.data.gov.uk/def/common/freehold",
          label: [{ _value: "Freehold", _datatype: "langString", _lang: "en" }],
        },
        newBuild: false,
        pricePaid: 130000,
        propertyAddress: {
          _about: "http://landregistry.data.gov.uk/data/ppi/address/ac06477799ba6a9fa44ea85f8a6a6441bc8540ca",
          county: "CITY OF DERBY",
          district: "CITY OF DERBY",
          paon: "164",
          postcode: "DE23 8PL",
          street: "PEAR TREE STREET",
          town: "DERBY",
        },
        propertyType: {
          _about: "http://landregistry.data.gov.uk/def/common/terraced",
          label: [{ _value: "Terraced", _datatype: "langString", _lang: "en" }],
        },
        transactionDate: "Fri, 14 Jun 2024",
      },
      {
        _about: "http://landregistry.data.gov.uk/data/ppi/transaction/OTHER/current",
        estateType: {
          _about: "http://landregistry.data.gov.uk/def/common/leasehold",
          label: [{ _value: "Leasehold", _datatype: "langString", _lang: "en" }],
        },
        newBuild: true,
        pricePaid: 250000,
        propertyAddress: {
          _about: "http://landregistry.data.gov.uk/data/ppi/address/other",
          saon: "Flat 2",
          paon: "10",
          postcode: "DE23 8PL",
          street: "OTHER STREET",
        },
        propertyType: {
          _about: "http://landregistry.data.gov.uk/def/common/flat-maisonette",
          label: [{ _value: "Flats/Maisonettes", _datatype: "langString", _lang: "en" }],
        },
        transactionDate: "Fri, 15 Dec 2023",
      },
    ],
  },
};

function mockFetch(status: number, body?: unknown) {
  return vi.fn(async (..._args: Parameters<typeof fetch>) => {
    void _args;
    return { ok: status >= 200 && status < 300, status, json: async () => body } as Response;
  });
}

describe("fetchSalesForPostcode", () => {
  it("maps transaction records into PropertySale shape, most recent first", async () => {
    const fetchImpl = mockFetch(200, SAMPLE_RESPONSE);
    const sales = await fetchSalesForPostcode("DE23 8PL", 50, fetchImpl);

    expect(sales).toHaveLength(2);
    expect(sales[0]).toEqual({
      pricePaid: 130000,
      saleDate: "2024-06-14",
      propertyType: "terraced",
      newBuild: false,
      tenure: "freehold",
      addressLine1: "164 PEAR TREE STREET",
      postcode: "DE23 8PL",
    });
    expect(sales[1]).toEqual({
      pricePaid: 250000,
      saleDate: "2023-12-15",
      propertyType: "flat",
      newBuild: true,
      tenure: "leasehold",
      addressLine1: "Flat 2 10 OTHER STREET",
      postcode: "DE23 8PL",
    });
  });

  it("builds the request URL with sort, page size and postcode params", async () => {
    const fetchImpl = mockFetch(200, { result: { items: [] } });
    await fetchSalesForPostcode("de23 8pl", 50, fetchImpl);
    const url = fetchImpl.mock.calls[0][0] as string;
    expect(url).toContain("propertyAddress.postcode=DE23");
    expect(url).toContain("_sort=-transactionDate");
    expect(url).toContain("_pageSize=50");
  });

  it("caps the requested page size at 200 (the service's documented limit)", async () => {
    const fetchImpl = mockFetch(200, { result: { items: [] } });
    await fetchSalesForPostcode("DE23 8PL", 500, fetchImpl);
    const url = fetchImpl.mock.calls[0][0] as string;
    expect(url).toContain("_pageSize=200");
  });

  it("returns an empty array for a postcode with no matching sales", async () => {
    const fetchImpl = mockFetch(200, { result: { items: [] } });
    const sales = await fetchSalesForPostcode("ZZ1 1AA", 50, fetchImpl);
    expect(sales).toEqual([]);
  });

  it("throws on a non-ok response status", async () => {
    const fetchImpl = mockFetch(500);
    await expect(fetchSalesForPostcode("DE23 8PL", 50, fetchImpl)).rejects.toThrow();
  });

  it("skips a record with no resolvable property type by falling back to 'other'", async () => {
    const fetchImpl = mockFetch(200, {
      result: {
        items: [
          {
            newBuild: false,
            pricePaid: 100000,
            propertyAddress: { postcode: "DE23 8PL", street: "X STREET" },
            transactionDate: "Fri, 14 Jun 2024",
          },
        ],
      },
    });
    const sales = await fetchSalesForPostcode("DE23 8PL", 50, fetchImpl);
    expect(sales[0].propertyType).toBe("other");
    expect(sales[0].tenure).toBe("freehold");
  });

  it("drops a record missing a required field (price, date or postcode) rather than fabricating it", async () => {
    const fetchImpl = mockFetch(200, {
      result: {
        items: [
          { newBuild: false, propertyAddress: { postcode: "DE23 8PL" }, transactionDate: "Fri, 14 Jun 2024" }, // no price
        ],
      },
    });
    const sales = await fetchSalesForPostcode("DE23 8PL", 50, fetchImpl);
    expect(sales).toEqual([]);
  });
});
