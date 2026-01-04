# emanahmed752002-ttttt555

Next.js application with TypeScript, Tailwind CSS, and API routes.

## Structure

```
.
├── src/
│   ├── app/                 # App Router (Next.js 14+)
│   │   ├── api/            # API routes
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   ├── lib/               # Utilities & helpers
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript types
│   └── styles/            # Global styles
├── public/                # Static assets
└── package.json
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes

API routes are located in `src/app/api/`:
- `GET /api/health` - Health check
- `GET /api/users` - Get all users
- `GET /api/users/[id]` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

## Deploy

Deploy easily with [Vercel](https://vercel.com):

```bash
npm run build
npm start
```