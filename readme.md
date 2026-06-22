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

## Add A New Event (Runbook)

Use this monthly checklist to keep event updates complete.

- [ ] Create the event page in `src/` (copy the previous month), then set frontmatter: `permalink`, `title`, `description`, `eventId`, `showVenueSection`.
- [ ] Add or update the event in `src/_data/events.json` with `id`, date/display fields, URL/title, location fields, `overview`, and `sessionIDs`.
- [ ] Add or update talks in `src/_data/sessions.json` with unique session `id`, matching `eventID`, speaker/title/description, `status`, `videoUrl`, and `slidesUrl`.
- [ ] Keep event/session links in sync:
  - every `sessionIDs` entry must exist in sessions
  - every session with `eventID = X` must be listed in event `id = X` `sessionIDs`
- [ ] If no talks are confirmed yet, keep `sessionIDs` empty and show "coming soon" content.
- [ ] Confirm the page wiring still works: `events.findById(eventId)`, `currentEvent.sessionIDs`, and `eventVenues.findByEvent(currentEvent)`.
- [ ] If using a new venue, add an include under `src/_includes/venues/` and map it in `src/_includes/venue-details.njk`.
- [ ] Update ticketing links:
  - `ticketSystemEventId` in `src/_includes/layout.njk`
  - `/tickets` redirect in `src/staticwebapp.config.json`
  - `/next-event` redirect in `src/staticwebapp.config.json`
- [ ] Retire old short links/redirects in `src/staticwebapp.config.json` (keep historical event links stable).
- [ ] Update `src/_data/kofiSupporters.json` if new supporters were received.
- [ ] Optional polish: refresh images in `src/images/`, verify `hideMainLogo`/`hideNextEventBanner`, and check month/title/ticket wording.
- [ ] Validate before commit:
  - run `mise test`
  - run `mise run build`
  - spot-check with `mise start`: new event page, `/next-event`, `/tickets`, floating ticket button
- [ ] Final sanity check: upcoming lists look right, speaker cards render correctly (or "coming soon" intentionally), venue visibility toggles with `showVenueSection`, and no broken links remain.

### Test Structure

Tests are organized in the `tests/` directory:

```text
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

   ```text
   - [Project Name](https://your-project-url) — A short description. *by [Your Name](https://your-profile-link)*
   ```

4. If your project doesn't fit an existing section, add a new `##` heading.
5. Submit a Pull Request — all community project contributions are welcome!

> Not sure how to raise a PR? Drop a message via [contactus@devdottalk.uk](mailto:contactus@devdottalk.uk).
