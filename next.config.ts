import type { NextConfig } from "next";

// Content-Security-Policy. This is a reasonable, app-safe policy for a Next.js
// site. Note: 'unsafe-inline' is included for scripts/styles because Next (and
// Tailwind) emit small inline bits; a STRICTER nonce-based CSP is possible but
// needs middleware — a separate, bigger task. This still adds a real CSP where
// there was none.
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self' https:",
].join("; ");

// Security headers applied to every route. Each one addresses a specific
// finding from the OWASP ZAP baseline scan.
const securityHeaders = [
  // Anti-clickjacking (belt: header, suspenders: CSP frame-ancestors above).
  { key: "X-Frame-Options", value: "DENY" },
  // Stop browsers from MIME-sniffing responses.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Don't leak full URLs in the Referer header to other sites.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Turn off powerful browser features this marketing site doesn't use.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
];

const nextConfig: NextConfig = {
  // Remove the "X-Powered-By: Next.js" header (don't advertise the stack).
  poweredByHeader: false,

  async headers() {
    return [
      {
        // Apply to all routes.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
