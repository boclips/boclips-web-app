import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { BoclipsClient } from 'boclips-api-client';
import { Theme } from 'boclips-api-client/dist/sub-clients/alignments/model/Theme';

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

export const useGetTypesByProviderQuery = (
  provider: string,
): UseQueryResult<string[]> => {
  const client = useBoclipsClient();
  return useQuery(['typesByProvider', provider], () =>
    doGetTypesByProvider(client, provider),
  );
};

const doGetThemeByProviderAndId = (
  client: BoclipsClient,
  provider: string,
  id: string,
) => client.alignments.getThemeByProviderAndId(provider, id);

const doGetTypesByProvider = (client: BoclipsClient, provider: string) =>
  client.alignments.getAllTypesByProvider(provider);

export const useGetThemesByProviderQuery = (
  provider: string,
): UseQueryResult<Theme[]> => {
  const client = useBoclipsClient();
  return useQuery(['themesByProvider', provider], () =>
    doGetThemesByProvider(client, provider),
  );
};
