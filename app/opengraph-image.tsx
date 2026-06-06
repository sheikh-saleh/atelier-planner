import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Atelier — A daily routine planner worth keeping";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#FAF7F2",
          position: "relative",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(184, 149, 106, 0.06) 1px, transparent 0)",
            backgroundSize: "32px 32px",
            opacity: 0.6,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "80px 100px",
            height: "100%",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <div
              style={{
                fontSize: 36,
                fontStyle: "italic",
                color: "#2C2A26",
                fontFamily: "serif",
                letterSpacing: "-0.02em",
              }}
            >
              Atelier
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#B8956A",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontFamily: "serif",
              }}
            >
              Daily Routine
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 88,
                fontStyle: "italic",
                color: "#2C2A26",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                fontFamily: "serif",
                maxWidth: 900,
              }}
            >
              Discipline,
              <br />
              <span style={{ color: "#B8956A" }}>repeated.</span>
            </div>
            <div
              style={{
                fontSize: 28,
                color: "#6B6862",
                marginTop: 32,
                maxWidth: 800,
                lineHeight: 1.4,
                fontFamily: "serif",
              }}
            >
              A classical, minimal daily routine planner. Free, offline, and
              privacy-first.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 32,
              color: "#A8A39A",
              fontSize: 18,
              fontFamily: "serif",
              fontStyle: "italic",
            }}
          >
            <span>✓ Free forever</span>
            <span>✓ No ads</span>
            <span>✓ Privacy first</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
