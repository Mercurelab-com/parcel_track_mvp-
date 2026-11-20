/**
 * Format ISO datetime strings to human-readable date and time.
 * Example: 2026-11-20T10:30:00Z -> "20 Nov 2026 \u2022 10:30 AM"
 */
export function formatDateTime(isoString) {
  if (!isoString) return '\u2014';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const formattedDate = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);

    const formattedTime = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);

    return `${formattedDate} \u2022 ${formattedTime}`;
  } catch {
    return isoString;
  }
}
