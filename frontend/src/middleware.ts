import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get response
  const response = NextResponse.next()

  // Add security headers
  const ContentSecurityPolicy = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https:;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self' http://localhost:8000 http://127.0.0.1:8000;
    media-src 'self';
    upgrade-insecure-requests;
  `

  // Add security headers
  const securityHeaders = {
    // HSTS - Since we're in local development, we'll skip this
    // 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    
    // Prevent XSS attacks
    'X-XSS-Protection': '1; mode=block',
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Referrer Policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Content Security Policy
    'Content-Security-Policy': ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
    
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    
    // Permissions Policy (formerly Feature-Policy)
    'Permissions-Policy': `
      camera=(),
      microphone=(),
      geolocation=(),
      interest-cohort=()
    `.replace(/\s{2,}/g, ' ').trim(),
  }

  // Add headers to response
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

// Specify which paths should be handled by middleware
export const config = {
  matcher: [
    // Match all paths except static files, api routes, and _next
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
}
