import { DateTime } from "luxon";

/**
 * Converts a date-time string in a specific timezone to a UTC Date.
 * @param dateTimeStr Date-time string (e.g. "2026-06-01T10:00:00" or ISO format)
 * @param timezone The source timezone (e.g. "Asia/Kolkata")
 * @returns UTC Date object
 */
export function toUTC(dateTimeStr: string | Date, timezone: string): Date {
  if (dateTimeStr instanceof Date) {
    return dateTimeStr;
  }
  
  // Parse input time string in the source timezone
  let dt = DateTime.fromISO(dateTimeStr, { zone: timezone });
  
  if (!dt.isValid) {
    // Try SQL format if ISO parsing fails
    dt = DateTime.fromSQL(dateTimeStr, { zone: timezone });
  }

  if (!dt.isValid) {
    dt = DateTime.fromFormat(dateTimeStr, "yyyy-MM-dd HH:mm:ss", { zone: timezone });
  }

  if (!dt.isValid) {
    dt = DateTime.fromFormat(dateTimeStr, "yyyy-MM-dd HH:mm", { zone: timezone });
  }

  if (!dt.isValid) {
    throw new Error(`Invalid date format: '${dateTimeStr}' in timezone '${timezone}'`);
  }

  return dt.toJSDate();
}

/**
 * Converts a UTC Date to a string in the target timezone in ISO 8601 format.
 * @param utcDate The Date object (UTC)
 * @param timezone The target timezone (e.g. "Asia/Kolkata")
 * @returns Formatted local date-time string
 */
export function toLocalString(utcDate: Date, timezone: string): string {
  const dt = DateTime.fromJSDate(utcDate).setZone(timezone);
  if (!dt.isValid) {
    throw new Error(`Invalid date or timezone: ${timezone}`);
  }
  return dt.toISO() ?? dt.toString();
}
