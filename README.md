# Prompt Vault

Prompt Vault is a simple personal prompt library for saving, organising and reusing prompts.

![Login](./images/Prompt-Vault-Home.png)

## Stack

- Next.js with the App Router
- TypeScript
- Tailwind CSS
- Prisma with SQLite
- Playwright for end-to-end tests

## Configuration

1. Create a `.env` file:

   ```bash
   cp .env.example .env
   ```

2. Create a [GitHub OAuth app](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app):

   Use this callback URL for local development:

   ```text
   http://localhost:3000/api/auth/github/callback
   ```

3. Update `.env`:

   - `APP_ORIGIN`
   - `SESSION_SECRET`
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `GITHUB_ALLOWED_USERNAME`

Environment notes:

- Set `APP_ORIGIN` to the full public address where Prompt Vault will run.
- For local development, use `http://localhost:3000`.
- For a production deployment behind a domain, use your real public URL, for example `https://prompts.domain.com`.
- `SESSION_SECRET` is required for both local and Docker use. It signs login sessions.
- Use a long random value for `SESSION_SECRET` and keep it stable for a given deployment.
- Changing `SESSION_SECRET` will sign everyone out.
- You can generate a suitable secret with:

  ```bash
  openssl rand -base64 32
  ```

## Run Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Generate the Prisma client and create the database:

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

## Test Locally with Docker

Use Docker locally when you want to test the production container shape before pushing changes. Day-to-day development is usually faster with `npm run dev`.

1. Build and start the local container:

   ```bash
   docker compose up --build
   ```

2. Then open [http://localhost:3000](http://localhost:3000).

Notes:

- The SQLite database and prompt attachments are stored in the local `storage/` folder and mounted into the container at `/app/data`.
- The main database file lives at `storage/dev.db`.
- Prompt attachments live under `storage/prompt-attachments/`.
- Local Docker publishes the app on [http://localhost:3000](http://localhost:3000).
- Docker uses an absolute SQLite path inside the container, `/app/data/dev.db`, so build-time and runtime Prisma point at the same database file.
- The container prepares the mounted `storage/` folder on startup, then runs the application as the non-root `nextjs` user.

## CI/CD

This repository uses GitHub Actions to test changes, build the production Docker image, publish it to GitHub Container Registry, and deploy it to the production server.

The CI workflow runs on pull requests and pushes to `main`:

1. Install dependencies with `npm ci`.
2. Run linting.
3. Build the Next.js application.
4. Run Playwright end-to-end tests.
5. Build the Docker image.
6. Start the image and run a smoke test against the homepage.

When CI passes on `main`, the CD workflow publishes the image to GHCR as:

- `ghcr.io/aut0nate/prompt-vault:latest`
- `ghcr.io/aut0nate/prompt-vault:<git-commit-sha>`

The commit SHA tag is useful for rollbacks because it points at one exact build.

If branch protection is enabled, require this CI status check before merging:

- `Lint, test and build Docker image`

### GitHub Secrets

The workflow uses the built-in `GITHUB_TOKEN` to publish to GHCR. Add these repository secrets before relying on automatic production deployment:

- `VPS_HOST` - production server host or IP address.
- `VPS_PORT` - SSH port.
- `VPS_USER` - SSH user.
- `VPS_SSH_KEY` - private SSH key for the deploy user.

After the first GHCR image is published, make the package public in GitHub if the production server should pull it without logging in.

The deployment workflow currently expects the production Compose directory to be `/opt/stacks/prompts/Prompt-Vault`. Update `.github/workflows/cd.yml` if your production server uses a different path.

## Production

The production server should pull the tested image from GHCR rather than building the app directly from source.

Use `docker-compose.prod.yml` as the production template. The CD workflow copies it to the production server as `docker-compose.yml` before each deployment.

It expects:

- The public GHCR image `ghcr.io/aut0nate/prompt-vault:${IMAGE_TAG:-latest}`.
- A local `.env` file on the production server containing production secrets.
- A local `storage/` directory for the SQLite database and prompt attachments.
- An existing external Docker network called `edge-net` for your reverse proxy.

Example deployment flow on the production server:

```bash
docker compose pull prompt-vault
docker compose up -d
docker compose logs -f prompt-vault
```

Because the image is public, the production server does not need to log in to GHCR to pull it. Keep production secrets only in the production `.env` file. Do not commit that file to GitHub.

Keep the production directory minimal:

- `docker-compose.yml`
- `.env`
- `storage/`

Before releases that touch database behaviour, back up the persistent storage directory:

```bash
cp -R storage "storage-backup-$(date +%Y-%m-%d)"
```

After deployment, verify:

- The public homepage loads.
- `/login` loads.
- GitHub login works with the production callback URL.
- Existing prompts and attachments are still present.

## Admin Area

- Public visitors can browse prompts.
- Only the allowed GitHub account can sign in and manage prompts.
- The login page lives at `/login`.
- The admin dashboard lives at `/admin`.

## Backups and Persistence

- The `storage/` folder is ignored by git and should be treated as local application data.
- Rebuilding or recreating the container will not remove your prompts as long as `storage/` remains in place.
- Do not run `docker compose down -v` if you want to keep your data.
- Back up Prompt Vault by copying the `storage/` folder to another location.

Example backup command:

```bash
cp -R storage "storage-backup-$(date +%Y-%m-%d)"
```

If you already have data in the old Docker volume, copy it into `storage/` before switching fully to the new setup.

## AI-Assisted Development

Prompt Vault was built with **OpenAI Codex using GPT-5.4**. This repository includes an [`AGENTS.md`](./AGENTS.md) file, which provides structured instructions and context for AI coding agents. It defines expectations, constraints, and project-specific guidance to help keep contributions consistent and reliable.

## Contributions

Contributions, ideas, and suggestions are welcome.

If you have improvements, feature ideas, or bug fixes, feel free to open an issue or submit a pull request. All contributions are appreciated and help improve the project.
