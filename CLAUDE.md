React 18 SPA for the Boclips video library platform. Node 22.x required (`>=22.13.1 <23`).

## Commands

```bash
npm run dev          # Dev server on :9000 against staging backend
npm run local        # Dev server on :9000 against localhost:30000
npm run fake         # Dev server with in-memory FakeBoclipsClient — no auth needed

npm test                        # All Jest tests
npx jest path/to/File.test.tsx  # A single test file

npm run all-checks   # lint:errors + compile + test + build — the full CI gate
npm run lint:fix     # ESLint with auto-fix
npm run compile      # TypeScript type-check, no emit

npm run test-visual:open   # Start fake server + open Cypress UI
npm run test-visual        # Cypress headless with Percy snapshots (needs the fake server running)
```

## Layer conventions

- **`src/views/`** — route-level pages. Views own the React Query hooks, state, and business logic.
- **`src/components/`** — reusable UI, presentation only. **No barrel `index.ts` files** — import by
  direct file path.
- **`src/hooks/api/`** — all API calls, as React Query hooks.
- **`src/services/`** — pure functions and class utilities, no React dependencies.
- **Import with the `src/` prefix** (`import { Foo } from 'src/components/common/Foo'`). It is the one
  alias configured everywhere — `tsconfig.json` paths and `webpack.common.js` resolve.alias — alongside
  `resources/`. A `~/` alias exists **only** in `jest.config.js` moduleNameMapper, not in tsconfig or
  webpack, so a `~/` import type-checks and bundles as unresolved while passing tests. Nothing in `src/`
  uses it; don't introduce it.

## Conventions and gotchas

- **Search filter state lives in the URL, not React state.** `useSearchQueryLocationParams()` reads and
  writes every filter (query, page, `video_type`, `subject`, `duration`, …) through `URLSearchParams`
  plus React Router's `navigate()`. There is no filter store — adding a filter means adding it there.
- Each file in `src/hooks/api/` exports a plain `doXxx(params, client)` alongside its
  `useXxxQuery()`/`useXxxMutation()` hook. Keep that split: the `do` function is what makes the logic
  testable without React.
- **Two products, two subdomains.** `SubdomainRedirector` wraps all routes, fetches the current user,
  compares `user.account.products` against the hostname, and `window.location.replace()`s if they
  belong elsewhere — blocking route rendering until it decides. Use `useCurrentProduct()` for the
  active product and `useUserProducts()` for entitlements; don't read the hostname directly.
- **Access control is HATEOAS-driven, not role-driven.** `<FeatureGate>` takes exactly one of
  `linkName` / `anyLinkName` (renders if `client.links[...]` exists), `feature` (flag), or `product`
  (entitlement). `<AccessGate>` handles the two top-level cases: trial expired
  (`reportAccessExpired` link present) and no app access at all. So removing a link server-side is how
  access is revoked — which is what `bo.remove.cartLink()` simulates in tests.
- **Both CSS Modules (LESS) and Tailwind are load-bearing**, not one primary and one occasional. Each
  component has a co-located `style.module.less`; `tailwind.config.js` carries a custom 24-column grid
  with named row templates (`home`, `search-view`, `playlist-view`, …) and color utilities bridging to
  the LESS variables. Use `classnames` for conditional merging.
- All views are lazy-loaded via `lazyWithRetry`, which auto-reloads once on chunk load failure to
  survive stale browser caches after a deploy.
- `src/AppConstants.ts` reads all runtime config from `window.Environment`, injected by the HTML
  template at build time. It is the single source of truth for endpoints and feature toggles.
- Two entry points: `src/index.tsx` (authenticated) and `src/AppUnauthenticated.tsx` (registration and
  shared-content views).

## Testing

Suffixes distinguish the kinds: `.test.ts(x)`, `.integrationTest.tsx`, `.a11yTest.tsx`. Integration
and a11y tests render the **full `<App>`** in a `MemoryRouter` with `FakeBoclipsClient` and
`stubBoclipsSecurity` — end-to-end through the real component tree, not isolated units:

```ts
const fakeClient = new FakeBoclipsClient();
fakeClient.users.insertCurrentUser(UserFactory.sample({ account: { products: [Product.LIBRARY] } }));

render(
  <MemoryRouter initialEntries={['/videos']}>
    <App apiClient={fakeClient} boclipsSecurity={stubBoclipsSecurity} reactQueryClient={createReactQueryClient()} />
  </MemoryRouter>,
);
```

- **Testing Library is configured with `testIdAttribute: 'data-qa'`** — `getByTestId` reads `data-qa`,
  not `data-testid`.
- Seed state through `bo(client)` in `src/testSupport/` rather than poking the fake directly; it has
  `bo.create.*`, `bo.set.facets/features`, `bo.remove.*`, and `bo.inspect()`/`bo.interact()` escape
  hatches. `bo.create.fixtureSet.*` seeds whole scenarios in one call.
- Other helpers there: `lastEvent(client, type)` for analytics assertions, `wrapperWithClients()` for
  `renderHook()`, and `resizeToDesktop/Tablet/Mobile()` for breakpoints.
- Factories come from `boclips-api-client/dist/test-support` (`VideoFactory`, `UserFactory`, …), with
  local ones in `src/testSupport/`.
- Cypress specs (`cypress/e2e/*.cy.ts`) run against `npm run fake`, which exposes `window.bo` so specs
  seed through the same helper via `cy.bo((bo) => { … })`.
