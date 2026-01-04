# Types

This folder contains TypeScript type definitions and interfaces.

## Structure
- Shared types and interfaces
- Type guards and utility types
- Use PascalCase for file names

## Example
```typescript
// user.types.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'guest';
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}
```