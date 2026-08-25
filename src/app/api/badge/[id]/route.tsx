import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  let svgContent = null;
  if (id === "david") {
    svgContent = (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="48" fill="#324b4c" />
        <circle cx="50" cy="50" r="43" fill="none" stroke="#FCF8F2" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
    );
  } else if (id === "samuel") {
    svgContent = (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <rect x="5" y="5" width="90" height="90" rx="20" fill="#7d927a" />
        <rect x="10" y="10" width="80" height="80" rx="15" fill="none" stroke="#FCF8F2" strokeWidth="1.5" />
      </svg>
    );
  } else if (id === "upper_room") {
    svgContent = (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <path d="M12,5 L88,5 L88,40 C88,75 50,98 50,98 C50,98 12,75 12,40 Z" fill="#223637" />
        <path d="M17,10 L83,10 L83,40 C83,70 50,89 50,89 C50,89 17,70 17,40 Z" fill="none" stroke="#FCF8F2" strokeWidth="1.5" />
      </svg>
    );
  } else if (id === "paul") {
    svgContent = (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="#b75d32" />
        <polygon points="32,10 68,10 90,32 90,68 68,90 32,90 10,68 10,32" fill="none" stroke="#FCF8F2" strokeWidth="1.5" />
      </svg>
    );
  } else if (id === "nehemiah") {
    svgContent = (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <polygon points="25,5 75,5 95,50 75,95 25,95 5,50" fill="#3b5c5e" />
        <polygon points="28,11 72,11 89,50 72,89 28,89 11,50" fill="none" stroke="#FCF8F2" strokeWidth="1.5" />
      </svg>
    );
  } else if (id === "christmas_night") {
    svgContent = (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <rect x="42" y="5" width="16" height="10" fill="#a03c27" />
        <rect x="44" y="6" width="12" height="7" fill="none" stroke="#FCF8F2" strokeWidth="1.5" />
        <circle cx="50" cy="55" r="42" fill="#c84b31" />
        <circle cx="50" cy="55" r="37" fill="none" stroke="#FCF8F2" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
    );
  } else if (id === "welcome_badge") {
    svgContent = (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <polygon points="50,5 90,25 90,65 50,95 10,65 10,25" fill="#4a5568" />
        <polygon points="50,11 84,29 84,62 50,88 16,62 16,29" fill="none" stroke="#FCF8F2" strokeWidth="1.5" />
      </svg>
    );
  } else {
    svgContent = (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="48" fill="#cbd5e1" />
      </svg>
    );
  }

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "transparent" }}>
        {svgContent}
      </div>
    ),
    { width: 170, height: 170 }
  );
}
