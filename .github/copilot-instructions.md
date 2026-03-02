# {dev.talk} Website - Copilot Instructions

## Project Overview

Static community website built with **Eleventy (11ty)** and **Nunjucks templates**, hosted on Azure Static Web Apps. A monthly tech meetup site for Bournemouth/Dorset featuring sessions, speakers, venues, and event information.

**Key repos**: [devdottalkwebsite](https://github.com/mosoftwareenterprises/devdottalkwebsite)

## Architecture & Core Concepts

### Content Structure
- **No data files** – all content embedded inline in templates using Nunjucks macros
- **YAML frontmatter** defines each page: layout, title, description, includeBlueskyPosts, permalink
- **Base layout** (`src/_includes/layout.njk`) provides HTML scaffold with header, footer, favicon, OG tags
- **Index page** (`src/index.njk`) composed entirely of `{% include %}` statements pulling in 20+ section components

### Component Patterns

**Reusable macros** (`src/_includes/*.njk`) define repeating content blocks:
- `eventItem(date, eventUrl, eventTitle, photoUrl, video1Title, video1Url, ...)` – renders event cards
- `sessionInfoItem(title, duration, speakerName, speakerLink, description, videoLink, slidesLink)` – renders session entries

Page templates invoke macros: `{% import "session-info-item.njk" as session %}`  
then call: `{{ session.sessionInfoItem(...) }}`  
See [src/previous-sessions.njk](src/previous-sessions.njk) for examples.

### Image Handling

Custom Eleventy config (`.eleventy.js`) processes markdown images with extended attributes:
```markdown
![alt text](image.jpg){loading=lazy width=100%}
```

Transform extracts `{...}` attributes, encodes spaces in URLs, applies attributes to HTML `<img>` tags via JSDOM. Default: adds `loading="lazy"` if no attributes specified.

### Passthrough & Output

Eleventy copies static assets explicitly:
- CSS, JS, images, favicons, manifest → passed through to `_site/`
- Output location: `_site/` (configured in CI/CD)
- SWA config in `src/staticwebapp.config.json` routes redirects (e.g., `/next-event` → `/2026-march-location-info.html`)

## Development Workflow

### Setup
- **Runtime requirement**: Node 24 (enforced via `mise.toml`)
- **Tool**: [mise](https://mise.jdx.dev/) manages node/tooling
- **Install**: `mise install` then `mise start` (runs build + start tasks)

### Build & Serve
```bash
npm run build    # eleventy build → _site/
npm start        # eleventy --serve (watches src/, live reload on :8080)
npm run preview  # static server on :8080 after build
```

### Git Workflow
- Main branch auto-deploys via GitHub Actions → Azure Static Web Apps
- PR workflow: opens staging environment, closes on merge
- Merge strategy: standard (no special rebasing rules)

## Key Files & Directories

| Path | Purpose |
|------|---------|
| [src/*.njk](src/) | Page templates (index, previous-sessions, call-for-speakers, etc.) |
| [src/_includes/layout.njk](src/_includes/layout.njk) | Base HTML template with logo, styles, OG tags |
| [src/_includes/*.njk](src/_includes/) | Reusable macros (eventItem, sessionInfoItem, floating-register-button) |
| [src/_includes/index/](src/_includes/index/) | Index page sections (section-welcome.njk, section-venues.njk, etc.) |
| [.eleventy.js](.eleventy.js) | Config: image processing, markdown anchors, passthrough copy |
| [src/styles.css](src/styles.css) | Main stylesheet |
| [src/bluesky.js](src/bluesky.js) | Bluesky social feed embed script |
| [staticwebapp.config.json](src/staticwebapp.config.json) | Azure SWA redirects & SPA fallback |

## Common Tasks

**Add a new page**: Create `src/new-page.njk` with frontmatter + content  
**Add index section**: Create `src/_includes/index/section-name.njk`, include in [src/index.njk](src/index.njk)  
**Add session/event**: Call macro in template (see [previous-sessions.njk](src/previous-sessions.njk) line 14+)  
**Update redirect**: Edit [staticwebapp.config.json](src/staticwebapp.config.json) routes

## Deployment

**CI/CD trigger**: Push to `main` branch  
**Pipeline**: `.github/workflows/azure-static-web-apps-*.yml`
- Installs mise + node 24
- Runs `npm ci` + `npm run build`
- Deploys `_site/` to Azure Static Web Apps
- PR creates staging environment automatically

## Development Conventions

- **File naming**: Kebab-case for .njk files (e.g., `previous-sessions.njk`)
- **Macro naming**: camelCase (e.g., `sessionInfoItem`, `eventItem`)
- **Frontmatter fields**: Consistent across pages (layout, title, description, permalink)
- **No data formats**: Avoid creating new patterns relying on data files
- **Markdown content**: Use `.md` or `.njk`; markdown-it-anchor auto-generates heading anchors
- **Bluesky feed**: Include `includeBlueskyPosts: true` in frontmatter to load 3 posts

## Testing & Validation

- **Markdown lint**: [.markdownlint.json](.markdownlint.json) configured
- **Manual testing**: `npm start` locally before commits
- **PR validation**: GitHub Actions checks build succeeds

## Tools & Dependencies

| Package | Role |
|---------|------|
| @11ty/eleventy | SSG core |
| @11ty/eleventy-img | Image optimization |
| jsdom | DOM manipulation for image transforms |
| markdown-it-anchor | Auto heading anchors |

No TypeScript, linting, or unit tests in project.
