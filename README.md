# Prompt Hub

Prompt Hub is a simple personal prompt library for saving, organising, searching, favouriting, and reusing LLM prompts.

## Stack

- Next.js with the App Router
- TypeScript
- Tailwind CSS
- Prisma with SQLite
- Playwright for end-to-end tests

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env
   ```

3. Create a GitHub OAuth app:

   ```bash
   Callback URL: http://localhost:3000/api/auth/github/callback
   ```

4. Add your GitHub OAuth values to `.env`:

   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `GITHUB_ALLOWED_USERNAME`

5. Generate the Prisma client and create the database:

   ```bash
   npm run prisma:generate
   npm run db:push
   npm run db:seed
   ```

6. Start the app:

   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000).

## Admin area

- Public visitors can browse prompts.
- Only the allowed GitHub account can sign in and manage prompts.
- The login page lives at `/login`.
- The admin dashboard lives at `/admin`.

## Docker

Run Prompt Hub with Docker:

```bash
docker compose up --build
```

The SQLite database is stored in a named Docker volume mounted at `/app/prisma`.
