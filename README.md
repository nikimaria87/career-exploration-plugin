# NextJobber

A private Site-hosted ChatGPT plugin for independent job seekers. It combines original career self-reflection questionnaires, transferable-skill evidence, live remote job discovery, requirement comparisons, application drafts, learning plans, and an application tracker.

## Edit your own copy

This private repository contains the full application source and the current plugin package under `plugin-skills/`. **The plugin is named NextJobber.**

The original brand kit and its editable source are in [brand/nextjobber](brand/nextjobber/START-HERE.html). Download the folder and open `START-HERE.html` for the asset index, or `studio/index.html` for the local design editor.

- [Development guide](docs/DEVELOPMENT.md): install, run, test, edit assessments and workflows, and publish updates.
- [Project identity and source snapshot](docs/PROJECT.md): the existing Site, plugin, and source version this copy came from.
- [Repository](https://github.com/nikimaria87/career-exploration-plugin).

GitHub commits save your source changes. Publishing the Site and updating packaged chat skills are separate release steps; this repository has no automatic production deployment configured. Saved user data remains in the existing hosted database and is not part of this repository.

For local development, use Node.js 22.13 or newer and the pnpm version pinned in `package.json`:

```sh
git clone https://github.com/nikimaria87/career-exploration-plugin.git
cd career-exploration-plugin
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

Run `corepack pnpm test` and `corepack pnpm typecheck` before releasing. See the development guide for the local database setup and current hosting requirements.

## What runs where

- ChatGPT handles open-ended career interpretation, resume and cover letter writing, interview practice, and broader searches through available tools. Six packaged workflow skills guide these tasks.
- The Site MCP endpoint exposes 16 tools for scoped storage, deterministic assessment scoring, live Jobicy discovery, evidence coverage, learning plans, drafts, exports, and deletion.
- The companion dashboard lets signed-in users take questionnaires, save jobs, update their tracker, view drafts and complete learning milestones.
- No separate model API key is required. The website does not run a model or generate career advice independently of chat.

## Original questionnaires, version 1.0.0

Activities/interests (18 items), work values (8), transferable skill evidence (10), and learning readiness (8). These are original self-report questionnaires for exploration, not validated psychometric instruments. Scores describe responses and are not aptitude measures, percentiles, diagnostic results, learning-style labels, or employer screening scores. Null or omitted responses are skipped. A domain requires at least half of its items answered to have a score. The mean is rescaled as `(mean - 1) * 25`.

Learning priorities suggest practice tasks and observable evidence. Priorities should be reconciled with target-role requirements, actual examples, user budget and time. The skill-evidence questionnaire measures self-reported proficiency, not verified proficiency.

## Job discovery

The built-in feed uses the Jobicy public API, preserving source names and canonical job links. The public feed covers remote listings published in the last seven days. Geography restrictions remain relevant; this is not comprehensive market coverage. Optional salaries remain null when absent. Results may be cached for one hour. Taxonomy filters are discovered from the provider, and continuation cursors are opaque. Provider failures are errors, not zero-result successes. Use available job-search tools or web search in chat for broader/local/hybrid roles.

Provider documentation: https://github.com/Jobicy/remote-jobs-api

No connected-app connector is embedded in the Site: the eligibility discovery tool is unavailable in this session. Chat workflows may use job-search connectors that are available in the user's chat; these are separate from this server's built-in tools.

## Privacy and access

Sites owns authentication. Every private operation requires `oai-authenticated-user-id`, and all queries include that owner. Caller identity is never accepted as an input argument. Browser writes require a same-origin request; MCP calls rely on Sites authentication. Records are persisted in D1 and are never put in browser storage. Each record has a revision to reject stale overwrites. The export tool paginates; follow all pages. Individual deletion is permanent and requires the current revision.

The new Site and plugin start private. The data model scopes records per signed-in user if access is later expanded. Public distribution, legal/product policies, and validation of assessment claims require separate launch preparation. This build does not send applications, messages, enrollments, payments or notifications. Follow-up dates are stored tracker entries; actual future notifications require an explicitly created automation.

## Development and validation

Follow the installed Sites skill for dependencies, preview, building and publication. Keep the maintained Vinext/Cloudflare integration intact.

- `node tests/career.mjs`: exercises production application logic with an in-memory SQLite-backed D1 adapter and mocked provider responses. Checks account isolation, revisions, scoring, eligibility reporting, dates, export pagination, deletion, protocol discovery and API guards.
- `node node_modules/typescript/bin/tsc --noEmit`: type check.
- `node scripts/prepare-career-skills.mjs`: prepares six skills from the same workflow guidance after the test harness compiles it. Source skills live in `plugin-skills/skills/` and are installed into the Site's canonical plugin after publication.
- Schema: `db/schema.ts`; generated migration: `drizzle/0000_same_bromley.sql`.
- HTTP: `POST /mcp` for MCP; `POST /api/career` for same-origin dashboard actions.

Do not check in credentials, local runtime state, private test data, or environment files. Publish the exact committed source through the Sites workflow. Reuse the same Site and its provisioned plugin on subsequent updates.
