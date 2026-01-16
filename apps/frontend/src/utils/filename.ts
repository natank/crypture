export function buildExportFilename(ext: 'csv' | 'json'): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  // Date-only to align with acceptance criteria and tests
  return `portfolio-${yyyy}-${mm}-${dd}.${ext}`;
}
