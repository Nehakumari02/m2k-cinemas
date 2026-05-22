/**
 * Resolve API base URL for fetch calls.
 * - React dev (port 3000): use relative paths → webpack proxy → server
 * - App served from Express (port 8080 or production): relative paths → same server
 * - Override: REACT_APP_API_URL=http://localhost:YOUR_PORT
 */
export default function apiUrl(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`;

  if (typeof window !== 'undefined') {
    const { port, hostname } = window.location;
    // CRA dev server — proxy handles /school-group-inquiries etc.
    if (port === '3000' || (hostname === 'localhost' && port === '3000')) {
      return normalized;
    }
    // Same host as API (e.g. localhost:8080 serving build + API)
    if (port === '8080' || port === '' || port === '80' || port === '443') {
      return normalized;
    }
  }

  const base = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');
  return `${base}${normalized}`;
}
