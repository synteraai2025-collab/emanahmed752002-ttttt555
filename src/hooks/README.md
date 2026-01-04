# Custom Hooks

This folder contains reusable React custom hooks.

## Structure
- Use camelCase with "use" prefix (e.g., `useAuth.ts`, `useFetch.ts`)
- Extract common stateful logic from components
- Make hooks reusable and well-documented

## Example
```typescript
// useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```