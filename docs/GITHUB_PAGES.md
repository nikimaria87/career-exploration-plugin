# GitHub Pages deployment

The workflow in `.github/workflows/deploy-pages.yml` publishes only the `public/` directory. It runs when that directory or the workflow changes on `main`, and can also be run manually from Actions.

The main URL opens `brand-kit/START-HERE.html`. A lowercase `start-here.html` alias is also available at the site root, and `brand-kit/index.html` opens the same kit.

## Repository setting

Under Settings → Pages → Build and deployment, set Source to **GitHub Actions**. GitHub's branch-based publishing selector offers the repository root or `/docs`, rather than `/public`, so this project uses an artifact upload from `public/`.

## Updates

Edit the files under `public/brand-kit/` and commit them to `main`. The workflow publishes their exact static contents and preserves their relative asset links. Build tools and the server application are not part of this Pages deployment.

The career workspace's account storage and MCP tools still use their existing host. Website-template buttons and QR codes retain their existing private dashboard destination.
