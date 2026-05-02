# Prompt Vault

## Introduction

Prompt Vault is a personal web app for saving, organising, searching, and reusing LLM prompts in one place.

It is for people who want an easier way to keep useful prompts organised without leaving them scattered across notes apps, chat histories, and text files. The app stores prompts in a local SQLite database, lets you browse and search them in a clearer interface, and gives one allowed GitHub account access to manage the library.

![Screenshot or Preview](./images/Prompt-Vault-Home.png)

## Features

- Save prompts with a title, summary, category, and full Markdown content
- Organise prompts with tags and prompt types
- Search and filter the library by text, category, tag, type, and favourites
- Mark important prompts as favourites for quicker access
- Attach supporting files such as text, JSON, CSV, PDF, or YAML documents
- Browse prompts publicly while limiting editing to one allowed GitHub account

## Stack

- Node.js 20+
- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- SQLite
- Playwright
- Docker

## Requirements

Before running this project, install:

- Node.js 20 or newer
- npm
- Docker and Docker Compose, if you want to test or deploy the app with Docker

## Configuration (.env)

1. Create a `.env` file:

   ```bash
   cp .env.example .env
   ```

2. Create a [GitHub OAuth app](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) and use this callback URL:

   ```text
   http://localhost:3000/api/auth/github/callback
   ```

3. Update `.env` with the required values:

   - `DATABASE_URL`
   - `APP_ORIGIN`
   - `SESSION_SECRET`
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `GITHUB_ALLOWED_USERNAME`

Example `.env`:

```bash
DATABASE_URL="file:./dev.db"
APP_ORIGIN="http://localhost:3000"
SESSION_SECRET="replace-with-a-long-random-string"
GITHUB_CLIENT_ID="replace-with-your-github-oauth-app-client-id"
GITHUB_CLIENT_SECRET="replace-with-your-github-oauth-app-client-secret"
GITHUB_ALLOWED_USERNAME="your-github-username"
```

Environment notes:

- `DATABASE_URL` controls the SQLite database path for local development. The default `file:./dev.db` works for the local npm setup.
- `APP_ORIGIN` should be the full public address where Prompt Vault runs. Use `http://localhost:3000` locally, and your real domain in production.
- `SESSION_SECRET` is required for both local and Docker use. It signs login sessions, should be a long random value, and should stay stable for a given deployment.
- Changing `SESSION_SECRET` will sign everyone out.
- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` come from your GitHub OAuth app.
- `GITHUB_ALLOWED_USERNAME` is the only GitHub username allowed to sign in and manage prompts.

You can generate a suitable `SESSION_SECRET` with:

```bash
openssl rand -base64 32
```

## Test Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Prepare the application:

   ```bash
   npm run prisma:generate
   npm run db:push
   npm run db:seed
   ```

3. Start the app:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Test Locally Using Docker

Use Docker locally when you want to test the application before deploying to your server. Start by building the image:

1. Build and start the local container:

   ```bash
   docker compose up --build
   ```

2. Open [http://localhost:3000](http://localhost:3000).

Notes:

- The local `docker-compose.yml` file publishes port `3000` to `localhost`.
- The SQLite database and prompt attachments are stored in the local `storage/` folder and mounted into the container at `/app/data`.
- The main database file lives at `storage/dev.db`.
- Prompt attachments live under `storage/prompt-attachments/`.
- Docker uses the absolute SQLite path `/app/data/dev.db` inside the container so build-time and runtime Prisma point at the same database file.
- The container prepares the mounted `storage/` folder on startup, then runs the application as the non-root `nextjs` user.

## Server Deployment

You can run this on your own server by pulling the latest Docker image from `ghcr.io/aut0nate/prompt-vault:${IMAGE_TAG:-latest}`.

Use the structure that fits your own environment and preferred deployment methods.
For public-facing access, put the service behind HTTPS using a reverse proxy such as Nginx Proxy Manager, Caddy, Traefik, or any other preferred method.

For most Docker-based deployments:

1. Create a directory in your chosen location on your server, for example `/opt/stacks/prompts`.
2. Change into this directory.
3. Ensure the `docker-compose.prod.yml` file is saved in this directory.
4. Create a `.env` file:

   ```bash
   APP_ORIGIN="https://prompts.example.com"
   SESSION_SECRET="replace-with-a-long-random-string"
   GITHUB_CLIENT_ID="replace-with-your-github-oauth-app-client-id"
   GITHUB_CLIENT_SECRET="replace-with-your-github-oauth-app-client-secret"
   GITHUB_ALLOWED_USERNAME="your-github-username"
   IMAGE_TAG=latest
   ```

5. Create the persistent storage directory:

   ```bash
   mkdir -p storage
   ```

6. Create the external Docker network or use an existing one. If you use an existing network, update the `docker-compose.prod.yml` file accordingly.

   ```bash
   docker network create edge-net
   ```

7. Start the public image:

   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

8. Verify the public URL after deployment.

Example production files:

- `docker-compose.prod.yml`
- `.env`
- `storage/`

After deployment, verify:

- The public homepage loads.
- `/login` loads.
- GitHub login works with the production callback URL.
- Existing prompts and attachments are still present.

## AI-Assisted Development

Prompt Vault was built with **OpenAI Codex using GPT-5.4**. This repository includes an [`AGENTS.md`](./AGENTS.md) file, which provides structured instructions and context for AI coding agents. It defines expectations, constraints, and project-specific guidance to help keep contributions consistent and reliable.

## Contributions

Contributions, ideas, and suggestions are welcome.

If you have improvements, feature ideas, or bug fixes, feel free to open an issue or submit a pull request. All contributions are appreciated and help improve the project.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
