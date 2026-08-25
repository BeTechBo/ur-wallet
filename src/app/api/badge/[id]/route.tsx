import { ImageResponse } from "next/og";
import { User, Star, Flame, HeartHandshake, Home, Book, Music } from "lucide-react";

export const runtime = "edge";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  let svgContent = null;
  let title = "";
  let subtitle = "";
  let icon = null;

  if (id === "david") {
    title = "DAVID"; subtitle = "TASBEHA";
    icon = (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#FCF8F2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="12" r="6" />
        <circle cx="9" cy="12" r="2" />
        <path d="M5 12 C3 16, 8 18, 10.5 14 C12 11, 7 8, 5 12 Z" />
        <path d="M14 4 L6 20 L22 20 L18 12" />
        <line x1="14" y1="4" x2="14" y2="1" />
      </svg>
    );
    svgContent = (
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
        <circle cx="50" cy="50" r="48" fill="#324b4c" />
        <circle cx="50" cy="50" r="43" fill="none" stroke="#FCF8F2" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
    );
  } else if (id === "samuel") {
    title = "SAMUEL"; subtitle = "BIBLE STUDY";
    icon = <Book size={32} color="#FCF8F2" strokeWidth={1.5} />;
    svgContent = (
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
        <rect x="5" y="5" width="90" height="90" rx="20" fill="#7d927a" />
        <rect x="10" y="10" width="80" height="80" rx="15" fill="none" stroke="#FCF8F2" strokeWidth="1.5" />
      </svg>
    );
  } else if (id === "upper_room") {
    title = "UPPER ROOM"; subtitle = "FELLOWSHIP";
    icon = <Home size={32} color="#FCF8F2" strokeWidth={1.5} />;
    svgContent = (
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
        <path d="M12,5 L88,5 L88,40 C88,75 50,98 50,98 C50,98 12,75 12,40 Z" fill="#223637" />
        <path d="M17,10 L83,10 L83,40 C83,70 50,89 50,89 C50,89 17,70 17,40 Z" fill="none" stroke="#FCF8F2" strokeWidth="1.5" />
      </svg>
    );
  } else if (id === "paul") {
    title = "ST. PAUL"; subtitle = "SERVICE";
    icon = <HeartHandshake size={32} color="#FCF8F2" strokeWidth={1.5} />;
    svgContent = (
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
        <polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="#b75d32" />
        <polygon points="32,10 68,10 90,32 90,68 68,90 32,90 10,68 10,32" fill="none" stroke="#FCF8F2" strokeWidth="1.5" />
      </svg>
    );
  } else if (id === "nehemiah") {
    title = "NEHEMIAH"; subtitle = "ENGAGER";
    icon = <Flame size={32} color="#FCF8F2" strokeWidth={1.5} />;
    svgContent = (
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
        <polygon points="25,5 75,5 95,50 75,95 25,95 5,50" fill="#3b5c5e" />
        <polygon points="28,11 72,11 89,50 72,89 28,89 11,50" fill="none" stroke="#FCF8F2" strokeWidth="1.5" />
      </svg>
    );
  } else if (id === "christmas_night") {
    title = "CHRISTMAS"; subtitle = "MAJOR EVENT";
    icon = <Star size={28} color="#FCF8F2" fill="#FCF8F2" strokeWidth={1.5} />;
    svgContent = (
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
        <rect x="42" y="5" width="16" height="10" fill="#a03c27" />
        <rect x="44" y="6" width="12" height="7" fill="none" stroke="#FCF8F2" strokeWidth="1.5" />
        <circle cx="50" cy="55" r="42" fill="#c84b31" />
        <circle cx="50" cy="55" r="37" fill="none" stroke="#FCF8F2" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
    );
  } else if (id === "welcome_badge") {
    title = "WELCOME"; subtitle = "JOINED";
    icon = <User size={32} color="#FCF8F2" strokeWidth={1.5} />;
    svgContent = (
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
        <polygon points="50,5 90,25 90,65 50,95 10,65 10,25" fill="#4a5568" />
        <polygon points="50,11 84,29 84,62 50,88 16,62 16,29" fill="none" stroke="#FCF8F2" strokeWidth="1.5" />
      </svg>
    );
  }

  return new ImageResponse(
    (
      <div style={{ display: "flex", position: "relative", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "transparent" }}>
        {svgContent}
        {title && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: id === "christmas_night" ? 20 : 0 }}>
            {icon}
            <span style={{ color: "#FCF8F2", fontSize: 16, fontWeight: "900", letterSpacing: 2, marginTop: 4 }}>
              {title}
            </span>
            <span style={{ color: "#FCF8F2", fontSize: 12, fontWeight: "700", letterSpacing: 1, opacity: 0.8, marginTop: 2 }}>
              {subtitle}
            </span>
          </div>
        )}
      </div>
    ),
    { width: 170, height: 170 }
  );
}
