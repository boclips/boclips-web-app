import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryClientConfig } from 'src/hooks/api/queryClientConfig';
import React, { useEffect, useState } from 'react';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { ApiBoclipsClient, BoclipsClient } from 'boclips-api-client';
import { Route, Routes } from 'react-router-dom';
import { lazyWithRetry } from 'src/services/lazyWithRetry';
import axios from 'axios';
import { Constants } from 'src/AppConstants';
import FallbackView from 'src/views/fallback/FallbackView';

interface Props {
  reactQueryClient?: QueryClient;
  axiosApiClient?: BoclipsClient;
}

const RegisterView = lazyWithRetry(
  () => import('src/views/register/RegisterView'),
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
        <Routes>
          <Route path="/register" element={<RegisterView />} />
        </Routes>
      </BoclipsClientProvider>
    </QueryClientProvider>
  );
};

export default AppUnauthenticated;