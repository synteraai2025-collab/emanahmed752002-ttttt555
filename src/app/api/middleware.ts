import { NextRequest, NextResponse } from 'next/server';

export type ApiHandler = (
  request: NextRequest,
  context?: any
) => Promise<NextResponse>;

// Example: Error handling wrapper
export function withErrorHandling(handler: ApiHandler): ApiHandler {
  return async (request: NextRequest, context?: any) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error('API Error:', error);
      
      if (error instanceof Error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

// Example: Rate limiting
const rateLimits = new Map<string, { count: number; resetAt: number }>();

export function withRateLimit(
  handler: ApiHandler,
  limit: number = 10,
  windowMs: number = 60000
): ApiHandler {
  return async (request: NextRequest, context?: any) => {
    const ip = request.ip || 'unknown';
    const now = Date.now();
    const record = rateLimits.get(ip);

    if (record && now < record.resetAt) {
      if (record.count >= limit) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429 }
        );
      }
      record.count++;
    } else {
      rateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    }

    return handler(request, context);
  };
}

// Example: Authentication check
export function withAuth(handler: ApiHandler): ApiHandler {
  return async (request: NextRequest, context?: any) => {
    const token = request.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token here
    // const user = await verifyToken(token);
    // if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    return handler(request, context);
  };
}