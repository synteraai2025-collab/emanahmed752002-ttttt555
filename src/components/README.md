# Components

This folder contains reusable UI components.

## Structure
- Keep components small and focused on a single responsibility
- Use PascalCase for component file names (e.g., `Button.tsx`, `UserCard.tsx`)
- Create subfolders for complex components with multiple files

## Example
```
components/
├── Button.tsx
├── Card.tsx
└── UserCard/
    ├── UserCard.tsx
    ├── UserCard.test.tsx
    └── UserCard.module.css
```