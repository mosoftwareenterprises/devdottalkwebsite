# {dev.talk} website

Built using [Eleventy Static Site Generator](https://www.11ty.dev/), and hosted on [Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/overview).

To build and run it locally, install [mise](https://mise.jdx.dev/), then run `mise start` in the root folder.

Production website at [https://devdottalk.uk](https://devdottalk.uk)

## Mise Tasks

```bash
mise run build       # Build: npm install → npm ci → npm run build
mise run test        # Run tests: npm run test
mise run test-watch  # Run tests in watch mode: npm run test:watch
mise start           # Start dev: build → test → npm start (watch)
```

## Testing Guide

This project includes comprehensive unit tests for all Nunjucks components using [Vitest](https://vitest.dev/).

### Run Tests Locally

```bash
# Run tests once
mise x node@24 -- npm run test

# Run tests in watch mode (re-runs on file changes)
mise x node@24 -- npm run test:watch
```

### Tests on `mise start`

Tests automatically run before the development server starts:

```bash
mise test
```

If any test fails, the dev server will not start. Fix the failing tests and run again.

### Test Structure

Tests are organized in the `tests/` directory:

```
tests/
├── components/              # Component-specific tests
│   ├── speaker-session.test.js
│   ├── event-list-item.test.js
│   ├── session-info-item.test.js
│   └── floating-register-button.test.js
├── fixtures/               # Mock data for tests
│   └── data.js            # Fake session and event data (won't conflict with real data)
├── helpers/               # Test utilities and helpers
│   └── nunjucks.js        # Nunjucks rendering utilities for tests
└── vitest.config.js       # Vitest configuration
```
### Mock Data

The `tests/fixtures/data.js` file contains:

- **`mockSessions`** - 4 fake sessions with IDs 999, 998, 997, 996
- **`mockEvents`** - 3 fake events with test event IDs

Mock data uses completely fake URLs and names to avoid conflicts with real website data when searching or indexing.


## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Nunjucks Documentation](https://mozilla.github.io/nunjucks/)
- [Eleventy Documentation](https://www.11ty.dev/)


PRs welcome.

## Community Projects

The [`src/community-projects.md`](src/community-projects.md) page showcases blogs, articles, videos, GitHub repos, and websites created by {dev.talk} community members.

### How to Contribute

Adding your project takes a few minutes:

1. Open [`src/community-projects.md`](src/community-projects.md).
2. Find the section that best fits your project:
   - **Blogs & Personal Sites** — personal blogs or portfolio sites
   - **Articles** — published articles on Dev.to, Medium, personal blogs, etc.
   - **Videos** — YouTube videos, conference recordings, screencasts
   - **GitHub Repos & Open Source** — open source tools, libraries or experiments
   - **Websites & Apps** — live sites or apps you've built
3. Add a bullet point in this format:
   ```
   - [Project Name](https://your-project-url) — A short description. *by [Your Name](https://your-profile-link)*
   ```
4. If your project doesn't fit an existing section, add a new `##` heading.
5. Submit a Pull Request — all community project contributions are welcome!

> Not sure how to raise a PR? Drop a message via [contactus@devdottalk.uk](mailto:contactus@devdottalk.uk).