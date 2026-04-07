import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") ?? "thepointman.dev";
  const description = searchParams.get("description") ?? "Software engineering, algorithms, and courses.";
  const type = searchParams.get("type") ?? "blog";

  const typeLabel = type === "dsa" ? "DSA" : type === "course" ? "Course" : "Article";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          backgroundColor: "#0d0d0d",
          fontFamily: "monospace",
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "20px", fontWeight: "900" }}>
            <span style={{ color: "#cfcecd" }}>thepointman</span>
            <span style={{ color: "#4ade80" }}>.dev</span>
          </span>
          <span
            style={{
              color: "#4ade80",
              fontSize: "11px",
              padding: "2px 10px",
              border: "1px solid #166534",
              backgroundColor: "#052e16",
              borderRadius: "4px",
              marginLeft: "8px",
            }}
          >
            {typeLabel}
          </span>
        </div>

        {/* Title + description */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "20px" }}>
          <p
            style={{
              color: "#f1ecec",
              fontSize: title.length > 50 ? "42px" : "52px",
              fontWeight: "800",
              lineHeight: "1.15",
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            {title}
          </p>
          <p
            style={{
              color: "#b7b1b1",
              fontSize: "22px",
              lineHeight: "1.5",
              margin: 0,
              maxWidth: "900px",
            }}
          >
            {description.slice(0, 120)}{description.length > 120 ? "…" : ""}
          </p>
        </div>

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #262626",
            paddingTop: "24px",
          }}
        >
          <span style={{ color: "#656363", fontSize: "14px" }}>thepointman.dev</span>
          <span style={{ color: "#4ade80", fontSize: "14px" }}>$ read --article</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
