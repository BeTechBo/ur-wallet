import { ImageResponse } from "next/og";

export const runtime = "edge";
export const dynamic = "force-dynamic";

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
    icon = (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#FCF8F2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
      </svg>
    );
    svgContent = (
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
        <rect x="5" y="5" width="90" height="90" rx="20" fill="#7d927a" />
        <rect x="10" y="10" width="80" height="80" rx="15" fill="none" stroke="#FCF8F2" strokeWidth="1.5" />
      </svg>
    );
  } else if (id === "upper_room") {
    title = "UPPER ROOM"; subtitle = "FELLOWSHIP";
    icon = (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#FCF8F2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    );
    svgContent = (
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
        <path d="M12,5 L88,5 L88,40 C88,75 50,98 50,98 C50,98 12,75 12,40 Z" fill="#223637" />
        <path d="M17,10 L83,10 L83,40 C83,70 50,89 50,89 C50,89 17,70 17,40 Z" fill="none" stroke="#FCF8F2" strokeWidth="1.5" />
      </svg>
    );
  } else if (id === "paul") {
    title = "ST. PAUL"; subtitle = "SERVICE";
    icon = (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#FCF8F2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
        <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"></path>
        <path d="m18 15-2-2"></path>
        <path d="m15 18-2-2"></path>
      </svg>
    );
    svgContent = (
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
        <polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="#b75d32" />
        <polygon points="32,10 68,10 90,32 90,68 68,90 32,90 10,68 10,32" fill="none" stroke="#FCF8F2" strokeWidth="1.5" />
      </svg>
    );
  } else if (id === "nehemiah") {
    title = "NEHEMIAH"; subtitle = "ENGAGER";
    icon = (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#FCF8F2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
      </svg>
    );
    svgContent = (
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
        <polygon points="25,5 75,5 95,50 75,95 25,95 5,50" fill="#3b5c5e" />
        <polygon points="28,11 72,11 89,50 72,89 28,89 11,50" fill="none" stroke="#FCF8F2" strokeWidth="1.5" />
      </svg>
    );
  } else if (id === "christmas_night") {
    title = "CHRISTMAS"; subtitle = "MAJOR EVENT";
    icon = (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#FCF8F2" stroke="#FCF8F2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    );
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
    icon = (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#FCF8F2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    );
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
            <span style={{ color: "#FCF8F2", fontSize: 16, fontWeight: "bold", letterSpacing: 2, marginTop: 4 }}>
              {title}
            </span>
            <span style={{ color: "#FCF8F2", fontSize: 12, fontWeight: "normal", letterSpacing: 1, opacity: 0.8, marginTop: 2 }}>
              {subtitle}
            </span>
          </div>
        )}
      </div>
    ),
    { width: 170, height: 170 }
  );
}
