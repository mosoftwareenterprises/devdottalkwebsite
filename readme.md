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

Use this checklist each month to avoid missing linked updates.

1. Create the event page
   - Create a new file in `src/` (for example: `src/2026-july-location-info.md`).
   - Start from `src/2026-june-location-info.md` as the template.
   - In frontmatter set:
     - `permalink`
     - `title`
     - `description`
     - `eventId` (this is now the source of truth for page data)
     - `showVenueSection` (`false` while venue is hidden, then `true` when announcing location)

2. Add/update the event in data
   - Edit `src/_data/events.json`.
   - Add the new event object (or update placeholder event) with:
     - unique `id`
     - `date`, `displayDate`, `url`, `title`
     - `locationName`, `locationAddress`, `venueName`
     - `overview`
     - `sessionIDs` array
   - Keep `events.json` and `sessions.json` in sync:
     - every `sessionIDs` value must exist as a session `id`
     - every session with `eventID = X` must appear in event `id = X` `sessionIDs`

3. Add/update sessions
   - Edit `src/_data/sessions.json`.
   - Add session entries for the new talks with:
     - unique session `id`
     - `eventID` matching the event `id`
     - speaker, title, description, status, assets
   - If there are no confirmed sessions yet, keep event `sessionIDs` empty and show "coming soon" content.

4. Connect event, session, and venue
   - On the page file, set the new `eventId` in frontmatter.
   - The page uses:
     - `events.findById(eventId)` for event details
     - `currentEvent.sessionIDs` to render speaker blocks
     - `eventVenues.findByEvent(currentEvent)` to resolve venue block
   - If using a new venue, add a dedicated include in `src/_includes/venues/` and wire it in `src/_includes/venue-details.njk`.

5. Update ticket IDs and links
   - Update Luma checkout event id in `src/_includes/layout.njk` (`ticketSystemEventId`).
   - Update `/tickets` redirect in `src/staticwebapp.config.json`.
   - Update `/next-event` redirect in `src/staticwebapp.config.json`.

6. Deprecate last month's short links/redirects
   - In `src/staticwebapp.config.json`, review event-related routes and update/remove old redirects that should no longer be promoted.
   - Keep permanent links stable for already published event pages.

7. Update supporters
   - If new Ko-fi supporters were received, update `src/_data/kofiSupporters.json`.

8. Optional event polish
   - Add/update hero and speaker images under `src/images/`.
   - Check `hideMainLogo` / `hideNextEventBanner` values in frontmatter for the new page.
   - Confirm event copy references the right month, title, and ticket wording.

9. Validate before committing
   - Run:
     - `mise test`
     - `mise run build`
   - Spot-check locally with `mise start`:
     - new event page
     - `/next-event`
     - `/tickets`
     - floating ticket button behavior

10. Final sanity checks
   Confirm event appears correctly in upcoming lists, speaker cards render (or intentionally show "coming soon"), the venue section toggles correctly when `showVenueSection` changes, and there are no broken links in page content.

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
