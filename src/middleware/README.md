# Middleware

This folder contains Next.js middleware for request processing.

## Structure
Middleware runs before requests are completed, allowing you to:
- Modify request/response
- Redirect or rewrite
- Add headers
- Authentication checks

## Example
Create `middleware.ts` in the root:
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add custom header
  const response = NextResponse.next();
  response.headers.set('x-custom-header', 'value');
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```