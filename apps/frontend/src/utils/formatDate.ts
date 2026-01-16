// utils/formatDate.ts

/**
 * Returns a date string formatted as YYYY-MM-DD.
 * Useful for filenames (e.g., portfolio-2025-07-20.json).
 */
export function getFormattedDate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}
