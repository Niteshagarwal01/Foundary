import { FONTS } from "../data/fonts";

// Duplicate 4x for seamless infinite loop (50% translate = 2 copies)
const items = [
  ...FONTS,
  ...FONTS,
  ...FONTS,
  ...FONTS,
];

export default function Marquee({ inverted = false }) {
  return (
    <div
      className="overflow-hidden py-4 border-y"
      style={{
        borderColor: "rgba(201,163,85,0.2)",
        background: inverted ? "#F4EFE6" : "#0C0C0C",
      }}
    >
      <div className={inverted ? "marquee-track-reverse" : "marquee-track"}>
        {items.map((font, i) => (
          <span
            key={i}
            className="flex items-center gap-8 flex-shrink-0"
            style={{
              marginRight: "48px",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: inverted ? "#6B6560" : "#3A3A3A",
              fontFamily:
                i % 4 === 0
                  ? `'${font.family}', serif`
                  : i % 4 === 2
                  ? `'${font.family}', serif`
                  : "'Inter', sans-serif",
              fontStyle: i % 7 === 0 ? "italic" : "normal",
              whiteSpace: "nowrap",
            }}
          >
            {font.name}
            <span style={{ color: "#C9A355", fontSize: "5px", marginLeft: "0" }}>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
