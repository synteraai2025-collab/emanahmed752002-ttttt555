# Development Guide

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities & helpers
│   ├── api.ts            # API client
│   └── db.ts             # Database connection
├── types/                 # TypeScript types
└── middleware/            # Next.js middleware
```

## Adding New Features

### 1. Create API Route
```typescript
// src/app/api/posts/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ posts: [] });
}
```

### 2. Create Type
```typescript
// src/types/post.ts
export interface Post {
  id: string;
  title: string;
  content: string;
}
```

### 3. Add API Method
```typescript
// src/lib/api.ts
export const api = {
  posts: {
    getAll: () => fetchApi<{ data: Post[] }>('/api/posts'),
  },
};
```

### 4. Create Hook
```typescript
// src/hooks/usePosts.ts
export function usePosts() {
  // Implementation
}
```

### 5. Create Component
```typescript
// src/components/PostList.tsx
export default function PostList() {
  // Implementation
}
```

### 6. Create Page
```typescript
// src/app/posts/page.tsx
import PostList from '@/components/PostList';

export default function PostsPage() {
  return <PostList />;
}
```

## Best Practices

- Use TypeScript for type safety
- Keep components small and focused
- Use Server Components when possible
- Client Components only when needed (interactivity)
- Implement proper error handling
- Add loading states
- Write meaningful commit messages
- Keep dependencies updated