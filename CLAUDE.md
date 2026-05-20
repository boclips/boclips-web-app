# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server on :9000 against staging backend
npm run local        # Dev server on :9000 against localhost:30000 (local backend)
npm run fake         # Dev server with in-memory FakeBoclipsClient (no auth required)

npm test                        # Run all Jest tests
npx jest path/to/File.test.tsx  # Run a single test file

npm run lint:fix     # ESLint with auto-fix
npm run compile      # TypeScript type-check without emit
npm run all-checks   # lint:errors + compile + test + build (full CI gate)

npm run test-visual:open        # Start fake server + open Cypress UI
npm run test-visual             # Run Cypress headlessly with Percy snapshots (needs fake server running)
```

**Node version:** 22.x required (`>=22.13.1 <23`)

## Architecture

React 18 SPA for a video library platform. Two entry points: `src/index.tsx` (authenticated app) and `src/AppUnauthenticated.tsx` (registration and shared-content views). All views are lazy-loaded via `lazyWithRetry`, which auto-reloads once on chunk load failure to handle stale browser caches after deploys.

### Layer conventions

- **`src/views/`** — Route-level pages. Views own their React Query hooks, state, and business logic; rendering is delegated to components.
- **`src/components/`** — Reusable UI, presentation only. No barrel `index.ts` files — import by direct file path.
- **`src/hooks/api/`** — All API calls go here as React Query hooks.
- **`src/services/`** — Pure functions and class-based utilities with no React dependencies.

### Provider stack (App.tsx, outermost → innermost)

```
QueryClientProvider → ScrollToTop → ToastContainer → BoclipsSecurityProvider
  → BoclipsClientProvider → Suspense → JSErrorBoundary → AccessGate
    → SubdomainRedirector → Routes
```

### Multi-product: Library vs Classroom

The app serves two products (`Product.LIBRARY`, `Product.CLASSROOM`) at separate subdomains. After auth, `SubdomainRedirector` (wrapping all routes) fetches the current user, checks `user.account.products` against the current hostname, and calls `window.location.replace()` if the user belongs on a different subdomain — blocking route rendering until the decision is made. `useCurrentProduct()` resolves the active product from the hostname; `useUserProducts()` returns the user's entitlements.

### Access control — FeatureGate

`<FeatureGate>` accepts one of four mutually exclusive guard props:

| Prop | Logic |
|---|---|
| `linkName: AdminLinksKey` | Renders if `client.links[linkName]` exists (HATEOAS) |
| `anyLinkName: AdminLinksKey[]` | Renders if any of the links exist |
| `feature: FeatureKey` | Renders if the feature flag is enabled |
| `product: Product` | Renders if the user has that product entitlement |

`<AccessGate>` wraps all routes and handles two top-level cases: trial expired (`reportAccessExpired` link present) and no app access at all (neither `boclipsWebAppAccess` nor `classroomWebAppAccess` link). Several routes are wrapped in `<FeatureGate>` with a `linkName` prop directly in `App.tsx` (e.g. `cart`, `userOrders`, `assistant`).

### Data fetching

Each file in `src/hooks/api/` exports a plain `doXxx(params, client)` async function alongside a `useXxxQuery()` or `useXxxMutation()` hook. The hook calls `useBoclipsClient()` and wraps the `do` function with `useQuery`/`useMutation`. The `doXxx` split makes logic testable without React.

**Search filters live in the URL**, not React state. `useSearchQueryLocationParams()` reads and writes all filter state (query, page, `video_type`, `subject`, `duration`, etc.) via `URLSearchParams` + React Router's `navigate()`. There is no separate filter store.

### Styling

**CSS Modules with LESS** is the primary approach — each component has a co-located `style.module.less`. **Tailwind** is also extensively used alongside CSS Modules, not just occasionally: the app has a custom 24-column grid layout with named row templates (`home`, `search-view`, `playlist-view`, etc.), custom color utilities bridging to LESS CSS variables, and extended spacing/sizing tokens, all configured in `tailwind.config.js`. Use `classnames` for conditional class merging.

### Runtime configuration

`src/AppConstants.ts` reads all config from `window.Environment`, injected by the HTML template at build time. It is the single source of truth for endpoints, host URLs, and feature toggle flags.

## Testing

Test files use suffixes `.integrationTest.tsx`, `.a11yTest.tsx`, or `.test.ts(x)`. Integration and a11y tests render the full `<App>` inside a `MemoryRouter` with `FakeBoclipsClient` and `stubBoclipsSecurity` — they test end-to-end behaviour through the real component tree, not isolated units.

### Standard integration test setup

```ts
const fakeClient = new FakeBoclipsClient();
fakeClient.users.insertCurrentUser(UserFactory.sample({ account: { products: [Product.LIBRARY] } }));

render(
  <MemoryRouter initialEntries={['/videos']}>
    <App apiClient={fakeClient} boclipsSecurity={stubBoclipsSecurity} reactQueryClient={createReactQueryClient()} />
  </MemoryRouter>,
);
```

### Key test utilities (`src/testSupport/`)

| Utility | Purpose |
|---|---|
| `bo(client)` | Builder facade for seeding complex `FakeBoclipsClient` state |
| `lastEvent(client, type)` | Retrieve the latest analytics event from `client.events.getEvents()` |
| `wrapperWithClients()` | Provider wrapper for `renderHook()` |
| `resizeToDesktop/Tablet/Mobile()` | Simulate responsive breakpoints |

**`bo()` API** — three namespaces:
- `bo.create.*` — insert videos, users (standard/trial), cart, playlists, and fixture sets; `bo.create.fixtureSet.eelsBiologyGeography()` seeds subjects, disciplines, videos, and facets in one call
- `bo.set.facets(partial)` / `bo.set.features({ [FeatureKey]: boolean })` — configure search facets and feature flags
- `bo.remove.cartLink()` — remove a HATEOAS link to simulate restricted access
- `bo.inspect()` / `bo.interact(callback)` — direct access to the underlying `FakeBoclipsClient`

Factories for test data come from `boclips-api-client/dist/test-support` (e.g. `VideoFactory`, `UserFactory`) and `src/testSupport/` for local ones.

Testing Library is configured with `testIdAttribute: 'data-qa'` — use `data-qa` attributes as selectors.

### Cypress e2e tests

Cypress tests (`cypress/e2e/*.cy.ts`) run against the fake server (`npm run fake`). The fake app exposes `window.bo` (the `bo()` helper wrapping `FakeBoclipsClient`) so tests can seed state via:

```ts
cy.bo((bo) => {
  bo.create.user();
  bo.set.features({ someFeatureKey: true });
});
```

## Path aliases

`~` and `src` both resolve to `src/` in TypeScript and Jest:

```ts
import { Foo } from '~/components/common/Foo';
```
