import { ImageResponse } from "next/og";

export const alt = "Lending Calculator — UK Mortgage & Property Calculators";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#f6f7fb",
          color: "#14161f",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "#0f6e5c",
            }}
          />
          <div style={{ fontSize: 40, fontWeight: 700 }}>Lending Calculator</div>
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.15, maxWidth: 950 }}>
          Every UK mortgage &amp; property calculation, in one place.
        </div>
        <div style={{ fontSize: 30, color: "#4b4f5c", marginTop: 28, maxWidth: 900 }}>
          LTV, repayments, loan-to-income, BTL ICR, rental yield, bridging costs &amp; more — free, no account.
        </div>
      </div>
    ),
    { ...size }
  );
}
