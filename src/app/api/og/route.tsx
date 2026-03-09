import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const score = parseInt(searchParams.get("score") ?? "0", 10);
  const label = searchParams.get("label") ?? "Exposed";
  const name = searchParams.get("name") ?? "Your household";

  const badgeBg =
    score >= 85
      ? "#dcfce7"
      : score >= 70
      ? "#d1fae5"
      : score >= 50
      ? "#fef3c7"
      : "#fee2e2";
  const badgeColor =
    score >= 85
      ? "#166534"
      : score >= 70
      ? "#065f46"
      : score >= 50
      ? "#92400e"
      : "#991b1b";

  const barColor =
    score >= 85
      ? "#16a34a"
      : score >= 70
      ? "#22c55e"
      : score >= 50
      ? "#f59e0b"
      : "#ef4444";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f6f3ef",
          padding: "64px",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        {/* Top: wordmark */}
        <div style={{ fontSize: 20, color: "#888888", fontWeight: 500 }}>authority</div>

        {/* Center: score */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: 14, color: "#888888", letterSpacing: "0.15em" }}>
            AUTHORITY INDEX
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "8px",
              lineHeight: 1,
            }}
          >
            <span style={{ fontSize: 120, fontWeight: 700, color: "#0a0a0a" }}>
              {score}
            </span>
            <span style={{ fontSize: 48, color: "#888888", marginBottom: "16px" }}>
              /100
            </span>
          </div>

          <div style={{ fontSize: 32, color: "#404040", fontWeight: 400 }}>
            {name}
          </div>

          {/* Score bar */}
          <div
            style={{
              width: "400px",
              height: "8px",
              background: "#e5e7eb",
              borderRadius: "4px",
              overflow: "hidden",
              display: "flex",
            }}
          >
            <div
              style={{
                width: `${score}%`,
                height: "100%",
                background: barColor,
                borderRadius: "4px",
              }}
            />
          </div>

          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "8px",
            }}
          >
            <div
              style={{
                background: badgeBg,
                color: badgeColor,
                fontSize: 22,
                fontWeight: 600,
                padding: "8px 20px",
                borderRadius: "8px",
              }}
            >
              {label}
            </div>
          </div>
        </div>

        {/* Bottom: tagline + url */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ fontSize: 18, color: "#666666" }}>
            Know where your authority breaks.
          </div>
          <div style={{ fontSize: 18, color: "#888888" }}>authority.fyi</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
