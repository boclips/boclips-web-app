import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryClientConfig } from 'src/hooks/api/queryClientConfig';
import React, { Suspense, useEffect, useState } from 'react';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { ApiBoclipsClient, BoclipsClient } from 'boclips-api-client';
import { Route, Routes } from 'react-router-dom';
import { lazyWithRetry } from 'src/services/lazyWithRetry';
import axios from 'axios';
import { Constants } from 'src/AppConstants';
import FallbackView from 'src/views/fallback/FallbackView';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Loading } from 'src/components/common/Loading';
import { Helmet } from 'react-helmet';
import NotFound from 'src/views/notFound/NotFound';

interface Props {
  reactQueryClient?: QueryClient;
  axiosApiClient?: BoclipsClient;
}

const RegisterView = lazyWithRetry(
  () => import('src/views/register/RegisterView'),
);

const ClassroomRegisterView = lazyWithRetry(
  () => import('src/views/classroom/register/ClassroomRegisterView'),
);

const UnauthorizedVideoView = lazyWithRetry(
  () => import('src/views/unauthorizedVideoView/UnauthorizedVideoView'),
);

const UnauthorizedPlaylistView = lazyWithRetry(
  () => import('src/views/unauthorizedPlaylistView/UnauthorizedPlaylistView'),
);

const queryClient = new QueryClient(queryClientConfig);

const AppUnauthenticated = ({
  reactQueryClient = queryClient,
  axiosApiClient,
}: Props) => {
  const [apiClient, setApiClient] = useState<BoclipsClient | null>(
    axiosApiClient,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (axiosApiClient) return;
    const initializeApiClient = async () => {
      try {
        const client = await ApiBoclipsClient.create(
          axios,
          Constants.API_PREFIX,
          Constants.CHAT_URL,
        );
        setApiClient(client);
      } catch (e) {
        console.error('Error initializing API client:', e);
        setError('Failed to initialize API client');
      }
    };

    initializeApiClient();
  }, []);

  if (error) {
    return <FallbackView />;
  }

  if (!apiClient) {
    return null;
  }

  return (
    <QueryClientProvider client={reactQueryClient}>
      <BoclipsClientProvider client={apiClient}>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/register" element={<RegisterView />} />
            <Route
              path="/classroom/register"
              element={<ClassroomRegisterView />}
            />
            <Route
              path="/videos/shared/:id"
              element={<UnauthorizedVideoView />}
            />
            <Route
              path="/playlists/shared/:id"
              element={<UnauthorizedPlaylistView />}
            />
            <Route
              path="*"
              element={
                <>
                  <Helmet title="Page not found" />
                  <NotFound unauthenticated />
                </>
              }
            />
          </Routes>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      </BoclipsClientProvider>
    </QueryClientProvider>
  );
};

export default AppUnauthenticated;
