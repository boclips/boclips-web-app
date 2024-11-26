import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useBoclipsClient } from '@components/common/providers/BoclipsClientProvider';
import { BoclipsClient } from 'boclips-api-client';
import { Theme } from 'boclips-api-client/dist/sub-clients/alignments/model/theme/Theme';
import { Provider } from 'boclips-api-client/dist/sub-clients/alignments/model/provider/Provider';

export const useGetThemeByProviderAndId = (
  provider: string,
  id: string,
): UseQueryResult<Theme> => {
  const apiClient = useBoclipsClient();

  return useQuery([`theme-${provider}`, id], () =>
    doGetThemeByProviderAndId(apiClient, provider, id),
  );
};

const doGetThemesByProvider = (
  client: BoclipsClient,
  provider: string,
): Promise<Theme[]> => {
  return client.alignments.getThemesByProvider(provider);
};

const doGetThemeByProviderAndId = (
  client: BoclipsClient,
  provider: string,
  id: string,
) => client.alignments.getThemeByProviderAndId(provider, id);

export const useGetThemesByProviderQuery = (
  provider: string,
): UseQueryResult<Theme[]> => {
  const client = useBoclipsClient();
  return useQuery(['themesByProvider', provider], () =>
    doGetThemesByProvider(client, provider),
  );
};

export const useGetProvidersQuery = (): UseQueryResult<Provider[]> => {
  const client = useBoclipsClient();
  return useQuery(['allProviders'], () => doGetProviders(client));
};

const doGetProviders = (client: BoclipsClient) =>
  client.alignments.getAllProviders();
