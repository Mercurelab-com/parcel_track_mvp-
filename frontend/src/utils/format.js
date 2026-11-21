// Contract: API sends UTC ISO 8601; show Cameroon time (WAT, UTC+1), e.g. "20 Nov 2026, 11:00 AM"
export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(iso) ? iso : iso + "Z");
  if (isNaN(d)) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit",
    hour12: true, timeZone: "Africa/Douala",
  }).format(d);
}
