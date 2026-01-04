# Database

This folder contains database schemas and migrations.

## Setup
1. Choose your database (PostgreSQL, MySQL, SQLite, etc.)
2. Install the appropriate client library:
   - PostgreSQL: `npm install pg`
   - MySQL: `npm install mysql2`
   - MongoDB: `npm install mongodb`
   - Prisma ORM: `npm install @prisma/client`

3. Update your `.env.local` with connection details
4. Run the schema to set up tables

## Using Prisma (Recommended)
```bash
npm install prisma @prisma/client
npx prisma init
# Edit prisma/schema.prisma
npx prisma migrate dev
npx prisma generate
```