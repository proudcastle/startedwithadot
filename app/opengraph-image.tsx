import { ImageResponse } from "next/og";

export const alt = "It All Started With a Dot";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#000",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "white",
            marginBottom: 40,
          }}
        />
        <div
          style={{
            color: "white",
            fontSize: 48,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          It All Started With a Dot
        </div>
        <div
          style={{
            color: "#a3a3a3",
            fontSize: 24,
            marginTop: 16,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          It does nothing. You decide what happens next.
        </div>
      </div>
    ),
    { ...size }
  );
}
