# Make your own updates

For the in-app assessment editor, chat authoring, brand colors, and the difference between GitHub Pages and the app, see [Editing NextJobber](EDITING_NEXTJOBBER.md).

## Local setup

Use Node.js 22.13 or newer. `tests/career.mjs` uses Node's built-in SQLite module. Use the exact pnpm version in `package.json` (`11.25.0` at export), through Corepack or a separately installed matching pnpm.

```sh
git clone https://github.com/nikimaria87/career-exploration-plugin.git
cd career-exploration-plugin
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

The portable development server uses port 5173. Local development uses mock authentication and a local D1 database, separate from the hosted account and database. Do not expose the mock-auth development server publicly.

If the local database has not been initialized, build once to generate the Wrangler configuration, then apply the existing migration to the local database:

```sh
corepack pnpm build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_same_bromley.sql
```

Start or restart `corepack pnpm dev` afterward. Apply each pending migration in order, once per local database; do not replay migrations already applied. This migration is for the local database only. Production database changes go through the existing Sites publication flow.

Within ChatGPT Work, use the installed Sites skill's dependency setup, source helper, and build commands. The checked-in `scripts/` provide the existing maintained framework integration; preserve that integration.

## Where to edit

| Change | Source |
| --- | --- |
| Dashboard and user flows | `app/dashboard.tsx` |
| Custom assessment editor | `app/assessment-workspace.tsx` |
| Custom questionnaire validation | `lib/career/assessment-templates.ts` |
| Styling | `app/globals.css` |
| Page title and description | `app/layout.tsx` |
| Questionnaire wording, domains, scoring, learning suggestions | `lib/career/assessments.ts` |
| Chat workflow guidance | `lib/career/workflows.ts` |
| Tool definitions and input validation | `lib/career/tools.ts` |
| MCP protocol endpoint | `app/mcp/route.ts` |
| Dashboard API | `app/api/career/route.ts` |
| Job provider and result mapping | `lib/career/jobs.ts` |
| User-scoped record storage | `lib/career/store.ts` |
| Database schema and migrations | `db/schema.ts`, `drizzle/` |
| Packaged chat skills | `plugin-skills/skills/` |
| Skill generator | `scripts/prepare-career-skills.mjs` |
| Current plugin package metadata | `plugin-skills/plugin.json`, `plugin-skills/.app.json`, `plugin-skills/.codex-plugin/plugin.json` |
| Existing Site identity and bindings | `.openai/hosting.json` |

## Check and save changes

```sh
corepack pnpm test
corepack pnpm typecheck
corepack pnpm build
git switch -c describe-your-change
git add app lib docs
git commit -m "Describe the resulting behavior"
git push -u origin describe-your-change
```

Stage the actual files you edited; the example paths are not an exhaustive list. Review changes in GitHub and merge when ready. No production deployment runs automatically from these commands.

The 20 behavior checks exercise account isolation, record revisions, scoring with skipped answers, job mapping, API guards, follow-up dates, exports, deletion, and MCP discovery, plus custom template validation, ownership, stale edits, scoring and result snapshots. Type checking and a build provide additional checks before publication. The behavior tests mock the external job feed and do not verify a live authenticated deployment.

## Keep the chat workflows in sync

Edit `lib/career/workflows.ts` first, then generate the packaged workflow files:

```sh
corepack pnpm plugin:skills
git diff -- plugin-skills/skills
```

The command runs the tests to compile the workflow source, then updates all six skill files. Reconcile any intentional edits in `scripts/prepare-career-skills.mjs` as well. Commit the generated skills alongside the workflow source.

Files under `plugin-skills/` form the plugin package, with `plugin.json` at that package root. The `.app.json` and compatibility manifest are a snapshot of the existing App connection; do not use them to create a duplicate App or change production identity.

## Publish a Site update

GitHub is your editable source repository. The dashboard and MCP tools still run on the existing Site. To release an application change through ChatGPT Work:

1. Select this repository and the existing Site identified in `docs/PROJECT.md`.
2. Ask to publish the selected commit to that existing Site, preserving its project ID and current audience. The Sites workflow retrieves its current source and short-lived write access, reconciles your changes, builds, commits/pushes the deployment source, and packages that exact commit.
3. Save and deploy the packaged source through Sites, then check the returned deployment status. Keep the existing database and App/plugin identity.
4. If workflow skills changed, retrieve the current plugin package and release ID through Plugin Creator. Reconcile with `plugin-skills/`, bump its semantic version, and submit a guarded update of the skills and supported metadata. Verify the saved files afterward. The App-backed plugin's title, App connection, and MCP configuration are owned by the Site.

For example: "Publish the latest main commit from nikimaria87/career-exploration-plugin to my existing NextJobber Site. Preserve its project, database, plugin identity, and private access. Update the six packaged skills if they changed."

The supported publication path needs Sites and, for packaged skills, Plugin Creator. The full app has no standalone deployment CLI or automatic GitHub-to-Sites pipeline. A separate GitHub Actions workflow publishes only `public/` to GitHub Pages. Deploying the application to another host would require implementing authentication and infrastructure for that host; the production auth headers are supplied by Sites.

## Rename the product

The selected brand is NextJobber. For a future rename, review these references. Search for current brand references:

```sh
rg -n 'NextJobber|career-compass' app lib scripts/prepare-career-skills.mjs plugin-skills README.md docs
```

Update the UI, page metadata, MCP display strings, workflows, generator, and documentation consistently. Regenerate packaged skills, then publish to the same Site and update its display title through Sites. Keep stable IDs and saved data. A Site title change does not change its URL. Renaming a repository or Site URL is a separate choice and needs corresponding documentation/link updates.

## Data and credentials

The GitHub repository holds code and schema. Production user records remain in D1. Keep `.env*`, `.dev.vars*`, `.wrangler/`, `.sites-runtime/`, build output, and production exports out of commits. Runtime secrets belong in Sites environment settings; publication credentials are short-lived and should never be committed.
