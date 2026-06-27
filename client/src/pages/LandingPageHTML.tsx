import { useEffect } from "react";

/**
 * DAWAA landing page
 * Uses the approved static design from DAWAA_EVENTS_CLIENT_PERMISSIONS_CLEAN_UPDATE.
 * This only changes the public landing page. Backend / Meta / RSVP files are untouched.
 */
export default function LandingPageHTML() {
  useEffect(() => {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
    document.body.style.margin = "0";
  }, []);

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#fff" }}>
      <iframe
        title="DAWAA Events Landing"
        src="/dawaa-design/index.html"
        style={{
          width: "100%",
          height: "100vh",
          minHeight: "100vh",
          border: 0,
          display: "block",
          background: "#fff",
        }}
      />
    </div>
  );
}
