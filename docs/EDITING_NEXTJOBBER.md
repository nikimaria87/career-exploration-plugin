# Make NextJobber your own

You can update NextJobber in three ways: use the assessment editor in the app, ask for changes in ChatGPT, or edit its code on GitHub.

## Create assessments without code

1. Open the NextJobber app and sign in with ChatGPT.
2. Choose **Explore yourself → Create assessment**.
3. Add a title, optional description, instructions, and five rating labels.
4. Add up to 50 questions. Give related questions the same scoring category.
5. Select **Save assessment**, then **Take assessment** to try it.

Use **Edit** on a custom assessment to change it or reorder its questions. The four built-in reflections remain available. Custom assessments and responses belong to your signed-in account. They are not automatically shared with other users.

Categories average the answered 1–5 ratings and convert the mean to 0–100 with `(mean - 1) × 25`. At least half of a category's questions must be answered to show a score. Skips are excluded. Write questions so higher ratings consistently mean more of the quality described. This editor does not support reverse scoring, weighted questions, branching, or validated psychometric scoring.

Each custom result stores the exact questions, instructions, rating labels, and template revision used. Editing or deleting a template keeps earlier results intact. Review them under **Your saved reflections**. Results are descriptive self-reports, not diagnoses, ability measures, population percentiles, or hiring predictions.

## Ask for changes in ChatGPT

For assessment content, use the NextJobber plugin and ask, for example:

> Create a private reflection about career change readiness, with 10 questions grouped into Clarity, Support, and Next steps. Use five agreement ratings and save it to my account.

The plugin can list, read, create, edit, and score your custom assessments once the matching app version is deployed. It must use actual answers and the current template revision. A stored question is content, not an instruction to the assistant.

For changes to the website itself, attach the existing NextJobber Site in ChatGPT and describe the change. For example:

> Add a new interview practice section to this NextJobber Site, keep the existing brand colors and account privacy, and publish the update.

Always select the existing Site so the update preserves its app identity and saved data.

## Edit code on GitHub

Source: https://github.com/nikimaria87/career-exploration-plugin

You can edit files in GitHub's web editor, open a codespace, or clone the repository. Commit changes to your own branch and merge them when ready. Never add credentials, personal assessment responses, or local database files.

| Change | Source files |
| --- | --- |
| Colors, typography, spacing | `app/globals.css` |
| Logo and favicon | `public/brand/`, `public/favicon.svg`, `app/layout.tsx` |
| Dashboard navigation and sections | `app/dashboard.tsx` |
| Assessment editor and questionnaire UI | `app/assessment-workspace.tsx` |
| Custom questionnaire validation | `lib/career/assessment-templates.ts` |
| Built-in questions and common scoring | `lib/career/assessments.ts` |
| Chat tools and saved records | `lib/career/tools.ts`, `lib/career/store.ts` |
| Chat workflow guidance | `lib/career/workflows.ts`, generated `plugin-skills/skills/` |
| Data schema and migrations | `db/schema.ts`, `drizzle/` |
| Static brand-kit page | `public/brand-kit/START-HERE.html` |

Use Node 22.13 or newer and the package manager pinned in `package.json`. Run `pnpm install`, then `pnpm dev` for local development. The production app uses Sites authentication, a Cloudflare Worker, and D1 storage. Local previews do not provide a real signed-in production session.

Before publishing source changes, run:

```sh
node tests/career.mjs
node node_modules/typescript/bin/tsc --noEmit
node scripts/prepare-career-skills.mjs
```

Publish the complete app through the existing Sites project's supported build and publication workflow. A GitHub commit does not automatically update the full Sites app. In ChatGPT, attach this Site and ask to import your GitHub branch or commit, review it, test it, and publish it. The Site's authenticated source repository is the deployment source; GitHub is a maintained copy for your own editing.

When adding a new tool, add its validated handler to `lib/career/tools.ts`, use authenticated owner-scoped storage, add meaningful tests, and update workflow guidance. Regenerate packaged skills after tests compile the workflow source. Plugin skills and the app's MCP server must be published together to make a new capability available in chat.

## GitHub Pages and the full app

| Address | What it runs | How it updates |
| --- | --- | --- |
| https://career-compass-explore-1022.fizzy-camel-0518.chatgpt.site | Full NextJobber app: sign-in, assessments, saved records, chat tools | Publish the existing Sites app |
| https://nikimaria87.github.io/career-exploration-plugin/ | Static files from `public/`, including the brand-kit hub | GitHub Pages workflow when `public/` changes on `main` |

GitHub Pages cannot run the app's Worker, private database, or authenticated MCP tools. It hosts the static brand assets. Its root and `start-here.html` redirect to `brand-kit/START-HERE.html`. To update those static pages, edit `public/`, commit to `main`, and check the **Deploy NextJobber brand kit to GitHub Pages** workflow in GitHub Actions. Do not copy private records into `public/`.

## Brand identity

NextJobber uses plum `#4C1734`, rose `#E3B4C6`, ink `#241C24`, warm gray `#766B70`, and paper `#FBF7F9`. Reuse the existing SVG wordmark and symbol in `public/brand/` for sharp rendering. The complete editable kit is in `brand/nextjobber/` in the GitHub repository and the static previews are in `public/brand-kit/`.
