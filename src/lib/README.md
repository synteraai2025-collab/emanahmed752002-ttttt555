# Lib

This folder contains utility functions, helpers, and shared logic.

## Structure
- API client functions
- Utility helpers
- Shared business logic
- Configuration helpers

## Example
```typescript
// api.ts
export async function fetchUsers() {
  const response = await fetch('/api/users');
  return response.json();
}

// formatters.ts
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
```