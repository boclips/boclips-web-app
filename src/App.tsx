import React, { Suspense, useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { BoclipsClient } from 'boclips-api-client';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Loading } from 'src/components/common/Loading';
import { hot } from 'react-hot-loader/root';
import { QueryClient, QueryClientProvider } from 'react-query';
import { queryClientConfig } from 'src/hooks/api/queryClientConfig';
import { trackPageRendered } from 'src/components/common/analytics/Analytics';
import { AnalyticsService } from 'src/services/analytics/AnalyticsService';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import ScrollToTop from 'src/hooks/scrollToTop';
import { Helmet } from 'react-helmet';
import { BoclipsSecurity } from 'boclips-js-security/dist/BoclipsSecurity';
import { WithValidRoles } from 'src/components/common/errors/WithValidRoles';
import { ROLES } from 'src/types/Roles';
import { lazyWithRetry } from 'src/services/lazyWithRetry';
import { BookmarkPlaylist } from 'src/services/bookmarkPlaylist';
import { BoclipsClientProvider } from './components/common/providers/BoclipsClientProvider';
import { BoclipsSecurityProvider } from './components/common/providers/BoclipsSecurityProvider';
import Appcues from './services/analytics/Appcues';
import { GlobalQueryErrorProvider } from './components/common/providers/GlobalQueryErrorProvider';
import { JSErrorBoundary } from './components/common/errors/JSErrorBoundary';

declare global {
  interface Window {
    Appcues: Appcues;
  }
}

const SearchResultsView = lazyWithRetry(
  () => import('./views/search/SearchResultsView'),
);
const HomeView = lazyWithRetry(() => import('./views/home/HomeView'));

const CartView = lazyWithRetry(() => import('src/views/cart/CartView'));

const OrdersView = lazyWithRetry(() => import('src/views/orders/OrdersView'));

const OrderView = lazyWithRetry(() => import('src/views/order/OrderView'));

const VideoView = lazyWithRetry(() => import('src/views/video/VideoView'));

const OrderConfirmationView = lazyWithRetry(
  () => import('src/views/orders/orderConfirmation/OrderConfirmationView'),
);

const ErrorView = lazyWithRetry(() => import('src/views/error/ErrorView'));

const NotFound = lazyWithRetry(() => import('src/views/notFound/NotFound'));

const FallbackView = lazyWithRetry(
  () => import('src/views/fallback/FallbackView'),
);

const AccessDeniedView = lazyWithRetry(
  () => import('src/views/accessDenied/AccessDenied'),
);

const LibraryView = lazyWithRetry(
  () => import('src/views/library/LibraryView'),
);

const PlaylistView = lazyWithRetry(
  () => import('src/views/playlist/PlaylistView'),
);

interface Props {
  apiClient: BoclipsClient;
  boclipsSecurity: BoclipsSecurity;
  reactQueryClient?: QueryClient;
}

const analyticsService = new AnalyticsService(window.Appcues);
const queryClient = new QueryClient(queryClientConfig);

const App = ({
  apiClient,
  boclipsSecurity,
  reactQueryClient = queryClient,
}: Props) => {
  const currentLocation = useLocation();

  useEffect(() => {
    apiClient.users
      .getCurrentUser()
      .then((user) =>
        analyticsService.identify({
          email: user.email,
          firstName: user.firstName,
          id: user.id,
        }),
      )
      .then(() => {
        AnalyticsFactory.getAppcues().sendEvent(AppcuesEvent.LOGGED_IN);
      });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    trackPageRendered(currentLocation, apiClient);
    analyticsService.pageChanged();
  }, [currentLocation, apiClient]);

  return (
    <QueryClientProvider client={reactQueryClient}>
      <GlobalQueryErrorProvider>
        <ScrollToTop />
        <BoclipsSecurityProvider boclipsSecurity={boclipsSecurity}>
          <BoclipsClientProvider client={apiClient}>
            <Suspense fallback={<Loading />}>
              <JSErrorBoundary fallback={<FallbackView />}>
                <WithValidRoles
                  fallback={<AccessDeniedView />}
                  roles={[ROLES.BOCLIPS_WEB_APP, ROLES.BOCLIPS_WEB_APP_DEMO]}
                >
                  <Helmet title="Boclips" />
                  <Switch>
                    <Route exact path="/">
                      <HomeView />
                    </Route>
                    <Route exact path="/videos">
                      <SearchResultsView />
                    </Route>
                    <Route exact path="/videos/:id">
                      <VideoView />
                    </Route>
                    <Route exact path="/cart">
                      <Helmet title="Cart" />
                      <WithValidRoles
                        fallback={<AccessDeniedView />}
                        roles={[ROLES.BOCLIPS_WEB_APP]}
                      >
                        <CartView />
                      </WithValidRoles>
                    </Route>
                    <Route exact path="/orders">
                      <Helmet title="Orders" />
                      <WithValidRoles
                        fallback={<AccessDeniedView />}
                        roles={[ROLES.BOCLIPS_WEB_APP]}
                      >
                        <OrdersView />
                      </WithValidRoles>
                    </Route>
                    <Route exact path="/orders/:id">
                      <WithValidRoles
                        fallback={<AccessDeniedView />}
                        roles={[ROLES.BOCLIPS_WEB_APP]}
                      >
                        <OrderView />
                      </WithValidRoles>
                    </Route>
                    <Route
                      exact
                      path="/error"
                      render={({ location }) => (
                        <ErrorView error={location?.state?.error} />
                      )}
                    />
                    <Route
                      path="/order-confirmed"
                      render={({ location }) => (
                        <>
                          <Helmet title="Order confirmed!" />
                          <OrderConfirmationView state={location?.state} />
                        </>
                      )}
                    />
                    <Route
                      exact
                      path="/library"
                      render={() => (
                        <>
                          <Helmet title="Your library" />
                          <LibraryView />
                        </>
                      )}
                    />
                    <Route
                      exact
                      path="/playlists/:id"
                      render={({ location }) => (
                        <>
                          <Helmet title={location.state?.name || 'Playlist'} />
                          <PlaylistView
                            bookmarkPlaylist={
                              new BookmarkPlaylist(apiClient.collections)
                            }
                          />
                        </>
                      )}
                    />
                    <Route>
                      <Helmet title="Page not found" />
                      <NotFound />
                    </Route>
                  </Switch>
                </WithValidRoles>
              </JSErrorBoundary>
            </Suspense>
            <ReactQueryDevtools initialIsOpen={false} />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>
      </GlobalQueryErrorProvider>
    </QueryClientProvider>
  );
};

export default hot(App);
