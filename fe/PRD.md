# Bonkey StreamV2 Product Requirements Document

**Status:** Approved for planning  
**Product type:** Personal anime streaming web application  
**Primary user:** Product owner  
**Interface language:** English  
**Experience priority:** UX-first, desktop-first, fully responsive, performance-conscious  
**Package manager:** pnpm

## 1. Product Summary

Bonkey StreamV2 is a personal anime discovery and streaming web application. It should let the user find an anime, inspect its available episodes, begin playback, resume from the last timestamp, maintain favorites and viewing history locally, and access downloads when the API provides them.

The product uses the dark, atmospheric, cyberpunk visual language documented in [`zenless.hoyoverse.com-DESIGN.md`](./zenless.hoyoverse.com-DESIGN.md). The reference informs atmosphere, hierarchy, motion, and media presentation without requiring a pixel-for-pixel reproduction.

## 2. Product Goals

1. Minimize the time and effort required to find and start an anime episode.
2. Make resuming an unfinished episode immediate and reliable.
3. Provide a clear desktop viewing experience while preserving full usability on tablet and mobile.
4. Keep favorites, history, playback progress, and preferences entirely in the browser.
5. Remain responsive when API data is slow, incomplete, empty, or temporarily unavailable.
6. Deliver a distinctive Zenless Zone Zero-inspired interface without sacrificing readability, accessibility, or performance.

## 3. Product Principles

- **Playback first:** Discovery should lead naturally to a working episode player.
- **Clear before cinematic:** Visual atmosphere must never obscure navigation, content, controls, or status.
- **Local by design:** Personal state stays on the current device and browser profile.
- **Progressive disclosure:** Show essential anime information first and reveal secondary metadata or downloads only when relevant.
- **Conditional UI:** Do not render empty download, synopsis, metadata, or taxonomy sections.
- **Fast feedback:** Every user action receives an immediate loading, success, empty, or error response.
- **Motion with purpose:** Animation communicates hierarchy, feedback, or state changes and respects reduced-motion preferences.

## 4. Primary User Journey

1. The user opens Home.
2. The user resumes an existing title or discovers an anime through latest, popular, ongoing, browse, schedule, or search.
3. Selecting a card opens the anime detail page.
4. The user chooses `Watch Now` or selects an episode.
5. The watch page loads the remembered quality when available, otherwise 720p or the nearest available quality.
6. Playback progress is saved locally during viewing.
7. At episode completion, the user can play the next episode.
8. The anime remains accessible through History or Favorites.

## 5. Information Architecture

### 5.1 Global Navigation

Use a single top navbar. Do not use a global sidebar.

Desktop navigation:

- Brand logo and `Bonkey StreamV2` wordmark
- Home
- Browse
- Schedule
- Favorites
- History
- Search

Mobile navigation:

- Compact brand mark
- Search action
- Menu action that opens an accessible navigation drawer

The desktop navbar must remain on one line. The current route must be indicated by more than color alone.

### 5.2 Routes

| Route | Purpose |
|---|---|
| `/` | Discovery, latest updates, popular titles, ongoing titles, and continue watching |
| `/browse` | Catalog browsing by type, genre, season, Movie, or BD |
| `/search?q=&page=` | Search results and pagination |
| `/schedule` | Anime release schedule |
| `/anime/:slug` | Anime information, episodes, favorite action, and conditional downloads |
| `/watch/:slug?episode=` | Player, quality and source selection, episode navigation, progress, and conditional downloads |
| `/favorites` | Locally saved favorites |
| `/history` | Local watch history and resume actions |
| `/:pathMatch(.*)*` | Branded not-found state with a route back to Home |

## 6. Functional Requirements

### 6.1 Home

- Show `Continue Watching` first when local history contains unfinished episodes.
- Fetch and render latest updates, popular titles, and ongoing titles.
- Use a media-first featured area sourced from available API content. Do not autoplay background video.
- Use horizontal content rails where they improve scanning, with keyboard-accessible controls and scroll snapping.
- Hide individual discovery sections whose successful API response is empty.
- When every discovery request succeeds with empty data, show a page-level empty state while preserving locally available Continue Watching content.
- When every discovery request fails, show a page-level error and retry action while preserving locally available Continue Watching content.
- For mixed outcomes, render successful nonempty sections and place a section-level retry state where a failed section would otherwise appear.
- Preserve stable layout space with content-shaped skeletons while requests are pending.

### 6.2 Search

- Search submits from the navbar or search page using the `q` query parameter.
- Trim the query and do not request an empty search.
- Encode all user-entered query parameters.
- Update the URL so search results can be refreshed or shared.
- Support API pagination.
- Show query-specific empty copy and a clear action back to Browse.
- Cancel a superseded request when the query or page changes.

### 6.3 Browse

- Provide entry points for Type, Genre, Season, Movie, and BD.
- Fetch taxonomy lists only when required and cache them for the current session.
- Represent the selected taxonomy and page in the URL.
- Support pagination returned by the API.
- Keep controls usable with keyboard input and at 200% zoom.
- Use a poster grid for catalog results with stable image ratios.

### 6.4 Schedule

- Render schedule data returned by the API without inventing unavailable day or time metadata.
- Each title links to its anime detail route.
- Provide loading, empty, and retry states.

### 6.5 Anime Detail

- Display available title, poster, synopsis, genres, rating, status, type, and other metadata.
- Omit individual fields that are empty or missing.
- `Watch Now` resumes the most recent unfinished episode for the title; otherwise it opens the first runtime-valid playback candidate in API order.
- Allow direct episode selection.
- Allow add/remove favorite with immediate optimistic feedback.
- Render the download section only when the API returns one or more valid download links.
- Preserve the API's real download grouping, including per-episode, quality, or batch groupings when supplied.

### 6.6 Watch and Player

- Use the native HTML5 video element.
- On desktop, place the player and episode panel side by side.
- On mobile, order content as player, controls, episodes, anime information, and downloads.
- Represent `episode` in the URL as a one-based index into the current API episode order.
- A missing, nonnumeric, out-of-range, or structurally invalid episode query resolves to the first runtime-valid playback candidate in API order and replaces the URL with the resolved index. A playback candidate has a normalized title and at least one validated source URL; confirmed browser playability is determined later by media events.
- Allow episode, quality, and source selection only from runtime-validated API data.
- If a stream format contains multiple URLs, expose them as `Server 1`, `Server 2`, and so on.
- Treat the API episode array order as playback order; previous and next episode actions use adjacent runtime-valid playback candidates in that order.
- Remember the most recently selected quality globally.
- Parse a quality from the numeric portion of a format label when present. Default to 720p when no preference exists, select the smallest absolute numeric difference, and prefer the lower quality when two formats are equally close. Non-numeric formats remain manually selectable but are not used for nearest-quality selection.
- Preserve the current episode in the route query.
- Store progress periodically, on pause, on episode change, and before document unload.
- Resume from the saved timestamp after metadata is available.
- Resolve saved history by exact `episodeTitle` first and use the stored one-based episode index only as a fallback. If neither resolves to a runtime-valid playback candidate, use the first candidate and retain the old history record until new playback begins.
- Consider an episode completed at 90% progress or greater.
- At completion, show `Play Next Episode` when another episode exists.
- Do not automatically start the next episode.
- If a stream fails, preserve the current episode and timestamp while offering another source, another quality, or retry.
- Validate stream collections and `http:` or `https:` source URLs before rendering them. A selected source becomes confirmed playable only after the native video element emits `loadedmetadata` or `canplay`; mark failed sources unavailable for the current session. If every selected or attempted source fails, show a dedicated unsupported or no-playable-source state without eagerly loading every source.
- Never persist raw stream URLs in local storage; persist anime slug, episode identity, quality preference, and time only.

### 6.7 Favorites

- Store favorite anime locally.
- Save only stable display information needed to render the collection: slug, title, thumbnail, and the time it was saved.
- Prevent duplicate entries by slug.
- Allow removal without a confirmation modal and provide a short undo opportunity.
- Show a useful empty state with a link to Browse.

### 6.8 History

- Sort items by most recent activity.
- Show title, thumbnail, last episode, progress, last watched time, and a `Resume` action.
- Allow removing one history item with undo.
- Allow clearing all history only after a consequence-specific confirmation.
- Keep favorites when history is cleared.
- Cap stored history at 100 titles, removing the least recently watched entries first.

### 6.9 Downloads

- Display downloads only when valid API data exists.
- Use the grouping and labels supplied by the API rather than inferring unavailable episode mappings.
- Support per-episode and batch links when those links are present.
- Open external downloads safely and clearly indicate that the action leaves the application.
- Treat a download link as valid only when it parses as an `http:` or `https:` URL.
- Hide the entire section when the list is missing or empty.

## 7. API Integration

### 7.1 Base URL

```text
https://v2-api-bonkeystream.vercel.app
```

API documentation:

```text
https://v2-api-bonkeystream.vercel.app/docs
```

### 7.2 Endpoint Mapping

| Product capability | Endpoint |
|---|---|
| Latest updates | `GET /api/home` |
| Popular titles | `GET /api/popular` |
| Ongoing titles | `GET /api/ongoing` |
| Search | `GET /api/search?q={query}&page={page}` |
| Type list | `GET /api/list-type` |
| Titles by type | `GET /api/type/{slug}?page={page}` |
| Season list | `GET /api/list-season` |
| Titles by season | `GET /api/season/{slug}?page={page}` |
| Genre list | `GET /api/list-genre` |
| Titles by genre | `GET /api/genre/{slug}?page={page}` |
| BD catalog | `GET /api/bd?page={page}` |
| Movie catalog | `GET /api/movie?page={page}` |
| Schedule | `GET /api/schedule` |
| Anime details, episodes, streams, downloads | `GET /api/watch/{slug}` |

### 7.3 Response Handling

The client must treat the API envelope as a discriminated union:

```ts
interface ApiSuccess<T> {
  success: true
  statusCode: number
  message: string
  data: T
}

interface ApiFailure {
  success: false
  statusCode: number
  message: string
  error?: string
}

type ApiResponse<T> = ApiSuccess<T> | ApiFailure
```

Requirements:

- Validate the envelope and branch on `success` before requiring or reading `data`.
- Treat fields inside scraped content as optional even when present in TypeScript models.
- Do not render source-site `link` values as internal navigation; use `slug` to construct application routes.
- Deduplicate simultaneous requests for the same resource.
- Abort stale route-level requests.
- Use a short in-memory cache for discovery and taxonomy data.
- Avoid unnecessary refetching to stay within the API limit of 100 requests per 15 minutes per client.
- Handle HTTP 400, 404, 429, 500, network errors, invalid JSON, and successful responses containing empty data.
- For HTTP 429, show a rate-limit-specific message and avoid automatic retry loops.

### 7.4 Expected Domain Models

```ts
interface AnimeSummary {
  title: string
  slug: string
  thumb?: string
  rating?: string
  status?: string
  episode?: string
  type?: string[]
  genres?: string[]
  latestEpisode?: number | null
}

interface StreamSource {
  format?: unknown
  url?: unknown
}

interface AnimeEpisode {
  title?: unknown
  streams?: unknown
}

interface DownloadQuality {
  quality?: string
  links: Array<{
    name: string
    url: string
  }>
}

interface DownloadGroup {
  title?: string
  qualities: DownloadQuality[]
}

interface AnimeDetail {
  title: string
  slug: string
  thumb?: string
  synopsis?: string
  info?: Record<string, string>
  genres?: string[]
  totalEpisodes?: number
  episodes?: AnimeEpisode[]
  downloads?: DownloadGroup[]
}
```

`StreamSource` and `AnimeEpisode` describe the untrusted transport boundary. Runtime guards must convert them into normalized internal models with a nonempty episode title, a displayable format label, and one or more valid `http:` or `https:` URLs before player components can consume them. A URL being valid does not guarantee that its protocol, container, or codec is supported by the browser.

## 8. Local Persistence

Use versioned local-storage keys and versioned payload wrappers so future schema migrations can be handled safely.

```text
bonkey:v2:favorites
bonkey:v2:history
bonkey:v2:preferences
```

### 8.1 Favorite Record

```ts
interface FavoriteRecord {
  slug: string
  title: string
  thumb?: string
  savedAt: string
}
```

### 8.2 History Record

```ts
interface HistoryRecord {
  slug: string
  title: string
  thumb?: string
  episodeTitle: string
  episodeIndex: number
  currentTime: number
  duration: number
  progress: number
  completed: boolean
  preferredQuality?: string
  updatedAt: string
}
```

### 8.3 Preferences

```ts
interface LocalPreferences {
  preferredQuality?: string
  reducedMotionOverride?: 'system' | 'reduce'
}

interface StoredPayload<T> {
  version: 2
  data: T
}
```

Persistence requirements:

- Wrap parsing and writing in safe utilities.
- Store every collection or preferences object inside `StoredPayload<T>`.
- Treat unwrapped payloads or payloads with an unsupported version as legacy data: migrate fields that pass validation and otherwise fall back to an empty valid state.
- Recover from corrupted JSON by falling back to an empty valid state.
- Do not throw route-breaking errors when storage is unavailable or full.
- Synchronize updates across browser tabs using the `storage` event.
- Throttle progress writes to avoid excessive main-thread and storage work.

## 9. Technical Architecture

### 9.1 Fixed Stack

- Vue 3
- Vite
- TypeScript
- Vue Router
- Tailwind CSS v4 through `@tailwindcss/vite`
- Motion for Vue through `motion-v`
- Lucide through `lucide-vue-next`
- Native Fetch API
- Native HTML5 video
- pnpm

### 9.2 State Strategy

- Use route state for shareable discovery, filter, search, pagination, anime, and episode state.
- Use composables for API resources, favorites, history, preferences, and playback persistence.
- Use component-local state for isolated UI behavior.
- Do not add Pinia unless implementation proves that composables cause unclear ownership or deep state coupling.

### 9.3 Suggested Boundaries

| Unit | Responsibility |
|---|---|
| `api` | Base request, envelope parsing, error normalization, aborting, caching, and endpoint functions |
| `models` | API and local-persistence TypeScript contracts |
| `composables` | Reusable resource, favorite, history, preference, and player logic |
| `components/ui` | Accessible visual primitives and complete interaction states |
| `components/anime` | Anime cards, rails, grids, metadata, episodes, and downloads |
| `components/player` | Video element, source selection, progress, and episode navigation |
| `layouts` | Global top navigation and responsive page shell |
| `views` | Route-level composition and data ownership |

## 10. Visual and Interaction System

### 10.1 Direction

- Atmospheric cyberpunk inspired by Zenless Zone Zero.
- Dark-only presentation using layered charcoal surfaces rather than pure black.
- Media-first layouts with deliberate negative space and controlled density.
- No global sidebar.
- No generic glass cards, purple gradient backgrounds, decorative status dots, fake metrics, or repeated equal-card marketing layouts.

### 10.2 Color

- Electric cyan is the primary interactive accent and should occupy approximately 3-5% of the interface.
- Royal blue supports secondary actions.
- Coral communicates errors or destructive actions.
- Gold is reserved for meaningful highlights.
- Neutral foreground and border colors must be recalibrated where required to meet WCAG AA.
- Convert the locked palette into semantic OKLCH tokens exposed through Tailwind v4 `@theme`.

### 10.3 Typography

- Display and navigation: Oxanium, self-hosted WOFF2.
- Body and UI text: IBM Plex Sans, self-hosted WOFF2.
- Body text must remain at least 16px on mobile.
- Headings must remain roman, readable, and limited to purposeful scale differences.
- Long titles must wrap safely without overflowing cards, rails, or the viewport.

### 10.4 Shape and Elevation

- Buttons: 24px radius.
- Inputs: 4px radius.
- Cards: 8px radius.
- Modals and large overlays: 16px radius.
- Use shadows only when elevation or interaction needs clarification.
- Poster cards are flat by default and receive a restrained interactive treatment on hover or focus.

### 10.5 Motion

- Target motion intensity: 4/10.
- Prefer CSS transitions for color, opacity, and small transforms.
- Use `motion-v` for route crossfades, drawer or modal presence, and meaningful layout or state transitions.
- Animate only transform and opacity where practical.
- Configure Motion for Vue to respect the user's reduced-motion preference.
- Reduced motion replaces spatial movement with an immediate state change or a crossfade no longer than 150ms.

### 10.6 Brand Assets

- Use `chibiItsuki` as the source image for the app mark and favicon.
- Produce square, center-cropped derivatives suitable for navigation and favicon sizes.
- Do not distort, recolor, or redraw the character art.

### 10.7 Visual References

- [Zenless Zone Zero official main site](https://zenless.hoyoverse.com/id-id/main)
- [Zenless Zone Zero official video gallery](https://zenless.hoyoverse.com/id-id/video)

## 11. Responsive Requirements

The product is desktop-first, not desktop-only.

| Width | Required behavior |
|---|---|
| 320-479px | Single-column content, 16px page gutters, player-first watch layout, 44px minimum targets |
| 480-767px | Single-column layout with wider rails and optional two-column compact results where content remains readable |
| 768-1023px | Tablet navigation, two or three-column catalog, stacked watch layout unless adequate player width remains |
| 1024-1199px | Compact desktop navigation and conditional two-column watch layout |
| 1200-1439px | Full navigation, player with episode side panel, four to six-column catalog |
| 1440px+ | Maximum 1440px content container with full feature visibility |

Requirements:

- No horizontal page overflow at 320, 375, 414, or 768px.
- Navbar labels and action labels must not wrap.
- Poster grids must use `minmax(0, 1fr)` tracks.
- Multi-column sections require an explicit under-768px fallback.
- The player must retain a 16:9 space before media metadata loads.
- Full-height mobile surfaces must use dynamic viewport units instead of `100vh`.

## 12. Accessibility Requirements

- Meet WCAG 2.2 AA for the application UI and custom player controls.
- Provide full keyboard navigation with logical focus order.
- Provide visible, immediate `:focus-visible` indicators at 3:1 minimum contrast.
- Maintain at least 4.5:1 contrast for normal text and 3:1 for large text and component boundaries where applicable.
- Use semantic landmarks including `header`, `nav`, `main`, and `footer`.
- Use real buttons and links rather than clickable generic containers.
- Give all meaningful posters and brand images appropriate alternative text.
- Treat decorative imagery as decorative.
- Provide accessible names for icon-only controls.
- Keep status messages available to assistive technology without moving focus unexpectedly.
- Ensure drawers and dialogs have accessible names, focus containment, Escape handling, and focus restoration.
- Do not communicate episode completion, favorites, active routes, or errors by color alone.
- Ensure the video element exposes native keyboard and assistive controls.
- Treat third-party media accessibility as a known content limitation because the current API does not expose captions, subtitles, or audio-description tracks. If track metadata becomes available, render it with native `<track>` elements and accessible track selection.
- Respect user motion preferences.

## 13. Performance Requirements

Core Web Vitals objectives for future field measurement:

- Largest Contentful Paint at or below 2.5 seconds at the 75th percentile.
- Interaction to Next Paint at or below 200ms at the 75th percentile.
- Cumulative Layout Shift at or below 0.1 at the 75th percentile.
- No long-running decorative animations during playback.
- No unnecessary route-level dependency loaded before it is needed.

MVP release uses a repeatable lab gate because the personal app does not include field telemetry. Run Lighthouse against the production build three times per route using the Lighthouse mobile preset for `/`, one populated Browse route, one Anime Detail route, and one Watch route with media autoplay disabled. Use the median result. Required lab thresholds are Performance 85 or greater, Accessibility 95 or greater, Best Practices 90 or greater, and CLS 0.1 or lower. External API or media outages must be recorded separately rather than hidden by test retries.

Implementation requirements:

- Lazy-load route components.
- Lazy-load below-the-fold posters and set explicit aspect ratios.
- Prioritize only the above-the-fold featured image.
- Use `decoding="async"` where appropriate.
- Avoid background video on Home.
- Deduplicate and cache safe GET requests.
- Abort stale requests.
- Avoid watcher or event-listener leaks.
- Throttle video progress persistence.
- Keep Motion usage isolated to components that require it.
- Use skeletons with final-content dimensions to prevent layout shift.
- Test player performance while rails or episode panels contain long lists.

## 14. Error, Empty, and Loading States

Every data-driven view must define:

- Initial loading state
- Background refresh state when applicable
- Success state
- Empty state
- Recoverable error state
- Offline or network-unavailable state
- Rate-limited state

Error messages must state what failed and what the user can do. Avoid endless retries. A route-level error must not erase valid favorites, history, or previously loaded local state.

Poster failure uses a branded neutral placeholder. Stream failure preserves the episode and saved timestamp. Corrupted local storage recovers to an empty valid state.

## 15. Testing Strategy

### 15.1 Unit Tests

Use Vitest for:

- API envelope parsing and error normalization
- Query and route construction
- Quality selection and nearest-quality fallback
- Episode completion threshold
- History sorting and 100-title cap
- Favorite deduplication
- Local-storage parsing, legacy-to-v2 migration, unsupported-version fallback, failure recovery, and throttling
- Download visibility rules

### 15.2 Component Tests

Use Vue Test Utils for:

- Anime card semantics and keyboard access
- Search validation
- Favorite toggle and undo
- History removal and clear confirmation
- Episode and quality selection
- Player resume behavior with a mocked media element
- Loading, empty, error, and success states
- Drawer and dialog focus behavior

### 15.3 End-to-End Tests

Use Playwright for:

- Home to detail to watch journey
- Search with pagination
- Browse filters represented in the URL
- Favorite persistence after reload
- Playback timestamp resume after reload
- Continue Watching behavior
- Episode completion and next-episode action
- Conditional download visibility
- Stream failure recovery
- Rate-limit error rendering
- History removal and clear history
- Desktop and mobile navigation
- No horizontal overflow at required widths

### 15.4 Quality Gates

Before completion:

- Typecheck passes.
- Lint passes.
- Unit and component tests pass.
- Critical Playwright journeys pass.
- Automated accessibility checks pass with no serious or critical violations.
- Lighthouse passes the defined three-run production-build lab profile.
- The changed-file scope receives a cleanup review that removes unused code, duplicated logic, needless single-use wrappers, stale exports, and debug leftovers without changing intended behavior. Typecheck, lint, and automated regression gates must pass again after any cleanup edit.

## 16. Acceptance Criteria

The product is ready when all of the following are true:

1. The user can reach every primary route from a top navbar without a global sidebar.
2. Home renders available latest, popular, ongoing, and continue-watching content within the CLS 0.1 budget and follows the defined all-empty, all-failed, and mixed-result behavior.
3. Search and browse work with URL-backed query, filters, and pagination.
4. Selecting an anime opens a detail page with only available metadata rendered.
5. The user can choose a runtime-valid episode candidate, quality, and source; a successfully loaded source plays natively, while attempted source failures preserve the selection and eventually produce the dedicated no-playable-source state when no alternatives remain.
6. Playback resumes from the locally stored episode and timestamp after reload using title-first and one-based-index fallback resolution.
7. Episodes at 90% progress or greater are marked complete.
8. The next-episode action appears when another runtime-valid playback candidate exists and does not autoplay without input.
9. Favorites and history persist locally and synchronize across open tabs.
10. Downloads appear only when the API provides valid links.
11. Empty downloads do not leave an empty heading, card, or placeholder section.
12. API, network, rate-limit, image, and stream failures have usable recovery paths.
13. The interface remains functional with missing synopsis, info, rating, thumbnails, streams, or downloads.
14. Keyboard-only users can navigate, search, select episodes, manage favorites, and operate the application and native player controls.
15. The application has no horizontal overflow at 320, 375, 414, 768, 1024, or 1440px.
16. The visual system follows the approved dark cyberpunk direction and uses `chibiItsuki` for the brand mark.
17. Production quality gates for typechecking, linting, tests, accessibility, and performance pass.

## 17. Delivery Sequence

1. Project foundation, routing, Tailwind tokens, fonts, and brand assets.
2. API client, domain models, error normalization, and request cache.
3. Shared layout, navbar, responsive drawer, UI primitives, and interaction states.
4. Home, anime cards, rails, and discovery resources.
5. Search, Browse, taxonomy filters, pagination, and Schedule.
6. Detail, episode list, favorites, downloads, and local persistence.
7. Watch page, player sources, progress, resume, quality preferences, and history.
8. Responsive refinement, accessibility, performance, and failure-state hardening.
9. Automated tests, production build verification, and the objective changed-file cleanup review defined by the quality gates.

## 18. Approved Decisions

- Product name: Bonkey StreamV2
- Audience: Personal use
- Interface language: English
- Primary navigation: Top navbar
- Global sidebar: None
- UX priority: Fast discovery, playback, and resume
- Device strategy: Desktop-first and fully responsive
- Account system: None
- Favorites and history: Local browser storage
- Resume: Episode and timestamp
- Completion threshold: 90%
- Next episode: User-triggered, not automatic
- Downloads: Conditional on API availability
- Styling: Tailwind CSS v4 primary, CSS optional
- Animation: Motion for Vue where justified, CSS transitions otherwise
- Icons: Lucide
- Player: Native HTML5 video
- Package manager: pnpm
- Display font: Oxanium
- Body font: IBM Plex Sans
- Visual reference: Zenless Zone Zero official site and video gallery
