# Deployment Guide

## Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables
4. Deploy!

```bash
npm i -g vercel
vercel
```

## Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t nextjs-app .
docker run -p 3000:3000 nextjs-app
```

## Environment Variables

Ensure all required environment variables are set:
- Database credentials
- API keys
- Authentication secrets
- External service URLs

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure database connection pooling
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Enable caching strategies
- [ ] Configure CDN for static assets
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up automated backups
- [ ] Configure logging