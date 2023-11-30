import React, { Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import MyTeamView from 'src/views/team/MyTeamView';
import { BoclipsClient } from 'boclips-api-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Loading } from 'src/components/common/Loading';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryClientConfig } from 'src/hooks/api/queryClientConfig';
import { trackPageRendered } from 'src/components/common/analytics/Analytics';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import ScrollToTop from 'src/hooks/scrollToTop';
import { Helmet } from 'react-helmet';
import { BoclipsSecurity } from 'boclips-js-security/dist/BoclipsSecurity';
import { WithValidRoles } from 'src/components/common/errors/WithValidRoles';
import { ROLES } from 'src/types/Roles';
import { lazyWithRetry } from 'src/services/lazyWithRetry';
import { FollowPlaylist } from 'src/services/followPlaylist';
import UserAttributes from 'src/services/analytics/hotjar/UserAttributes';
import { FeatureGate } from 'src/components/common/FeatureGate';
import useRedirectToWelcome from 'src/hooks/useRedirectToWelcome';
import FallbackView from 'src/views/fallback/FallbackView';
import { RedirectFromExploreToAlignments } from 'src/components/alignments/RedirectFromExploreToAlignments';
import * as Sentry from '@sentry/browser';
import { ToastContainer } from 'react-toastify';
import { BoclipsClientProvider } from './components/common/providers/BoclipsClientProvider';
import { BoclipsSecurityProvider } from './components/common/providers/BoclipsSecurityProvider';
import { GlobalQueryErrorProvider } from './components/common/providers/GlobalQueryErrorProvider';
import { JSErrorBoundary } from './components/common/errors/JSErrorBoundary';
import Pendo = pendo.Pendo;

declare global {
  interface Window {
    pendo: Pendo;
    hj: (command: string, id?: string, payload?: object) => void;
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

const AccessDeniedView = lazyWithRetry(
  () => import('src/views/accessDenied/AccessDenied'),
);

const PlaylistsView = lazyWithRetry(
  () => import('src/views/playlists/PlaylistsView'),
);

const PlaylistView = lazyWithRetry(
  () => import('src/views/playlist/PlaylistView'),
);

const ExploreView = lazyWithRetry(
  () => import('src/views/alignments/explore/ExploreView'),
);

const AlignmentsView = lazyWithRetry(
  () => import('src/views/alignments/AlignmentsView'),
);

const ThemeView = lazyWithRetry(
  () => import('src/views/alignments/theme/ThemeView'),
);

const RegisterView = lazyWithRetry(
  () => import('src/views/register/RegisterView'),
);

const MyAccountView = lazyWithRetry(
  () => import('src/views/account/MyAccountView'),
);

const TrialWelcomeView = lazyWithRetry(
  () => import('src/views/welcome/TrialWelcomeView'),
);

interface Props {
  apiClient: BoclipsClient;
  boclipsSecurity: BoclipsSecurity;
  reactQueryClient?: QueryClient;
}

const queryClient = new QueryClient(queryClientConfig);

const App = ({
  apiClient,
  boclipsSecurity,
  reactQueryClient = queryClient,
}: Props) => {
  const currentLocation = useLocation();

  useEffect(() => {
    apiClient.users.getCurrentUser().then((user) => {
      AnalyticsFactory.pendo().identify(user);
      AnalyticsFactory.hotjar().userAttributes(new UserAttributes(user));
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    trackPageRendered(currentLocation, apiClient);
  }, [currentLocation, apiClient]);

  const handleErrorCustomEvent = (event) => {
    console.error('error event occurred:', event);
    const error = event.error;
    if (error instanceof CustomEvent) {
      Sentry.captureException(new Error('error custom event exception'), {
        tags: {
          content: `${JSON.stringify(event)}`,
        },
        contexts: {
          extra: {
            description: `${JSON.stringify(event)}`,
          },
        },
      });
    }
  };

  document.addEventListener('error', handleErrorCustomEvent);

  return (
    <QueryClientProvider client={reactQueryClient}>
      <GlobalQueryErrorProvider>
        <ScrollToTop />
        <ToastContainer />
        <BoclipsSecurityProvider boclipsSecurity={boclipsSecurity}>
          <BoclipsClientProvider client={apiClient}>
            <JSErrorBoundary fallback={<FallbackView />}>
              <WithValidRoles
                fallback={<AccessDeniedView />}
                roles={[ROLES.BOCLIPS_WEB_APP_BROWSE]}
              >
                <Helmet title="CourseSpark" />
                <Suspense fallback={<Loading />}>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <>
                          <Helmet title="Home" />
                          <HomeView />
                        </>
                      }
                    />
                    <Route
                      path="/welcome"
                      element={
                        <>
                          <Helmet title="Welcome" />
                          <TrialWelcomeView />
                        </>
                      }
                    />
                    <Route
                      path="/videos"
                      element={
                        <>
                          <Helmet title="All Videos" />
                          <SearchResultsView />
                        </>
                      }
                    />
                    <Route path="/videos/:id" element={<VideoView />} />
                    <Route
                      path="/cart"
                      element={
                        <WithValidRoles
                          fallback={<AccessDeniedView />}
                          roles={[ROLES.BOCLIPS_WEB_APP_ORDER]}
                        >
                          <Helmet title="Cart" />
                          <CartView />
                        </WithValidRoles>
                      }
                    />
                    <Route
                      path="/orders"
                      element={
                        <WithValidRoles
                          fallback={<AccessDeniedView />}
                          roles={[ROLES.BOCLIPS_WEB_APP_ORDER]}
                        >
                          <Helmet title="My Orders" />
                          <OrdersView />
                        </WithValidRoles>
                      }
                    />
                    <Route
                      path="/orders/:id"
                      element={
                        <WithValidRoles
                          fallback={<AccessDeniedView />}
                          roles={[ROLES.BOCLIPS_WEB_APP_ORDER]}
                        >
                          <OrderView />
                        </WithValidRoles>
                      }
                    />
                    <Route path="/error" element={<ErrorView />} />
                    <Route
                      path="/order-confirmed"
                      element={<OrderConfirmationView />}
                    />
                    <Route path="/playlists" element={<PlaylistsView />} />
                    <Route
                      path="/sparks"
                      element={
                        <>
                          <Helmet title="Sparks" />
                          <AlignmentsView />
                        </>
                      }
                    />
                    <Route
                      path="/alignments"
                      element={
                        <>
                          <Helmet title="Alignments" />
                          <AlignmentsView />
                        </>
                      }
                    />
                    <Route
                      path="/library"
                      element={<Navigate to="/playlists" replace />}
                    />
                    <Route
                      path="/playlists/:id"
                      element={
                        <PlaylistView
                          followPlaylist={
                            new FollowPlaylist(apiClient.collections)
                          }
                        />
                      }
                    />
                    <Route path="/sparks/:provider" element={<ExploreView />} />
                    <Route
                      path="/alignments/:provider"
                      element={<ExploreView />}
                    />
                    <Route
                      path="/sparks/:provider/:id"
                      element={<ThemeView />}
                    />
                    <Route
                      path="/alignments/:provider/:id"
                      element={<ThemeView />}
                    />
                    <Route
                      path="/explore/*"
                      element={<RedirectFromExploreToAlignments />}
                    />
                    <Route
                      path="/team"
                      element={
                        <WithValidRoles
                          fallback={<NotFound />}
                          roles={[ROLES.ROLE_BOCLIPS_WEB_APP_MANAGE_USERS]}
                        >
                          <MyTeamView />
                        </WithValidRoles>
                      }
                    />
                    <Route
                      path="/account"
                      element={
                        <FeatureGate
                          feature="BO_WEB_APP_DEV"
                          fallback={<NotFound />}
                          isView
                        >
                          <MyAccountView />
                        </FeatureGate>
                      }
                    />
                    <Route
                      path="/register"
                      element={
                        <FeatureGate
                          feature="BO_WEB_APP_DEV"
                          fallback={<NotFound />}
                          isView
                        >
                          <RegisterView />
                        </FeatureGate>
                      }
                    />
                    <Route
                      path="*"
                      element={
                        <>
                          <Helmet title="Page not found" />
                          <NotFound />
                        </>
                      }
                    />
                  </Routes>
                </Suspense>
                <ReactQueryDevtools initialIsOpen={false} />
              </WithValidRoles>
            </JSErrorBoundary>
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>
      </GlobalQueryErrorProvider>
    </QueryClientProvider>
  );
};

export default App;
