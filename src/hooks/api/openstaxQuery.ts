import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { BoclipsClient } from 'boclips-api-client';
import { convertApiTheme } from 'src/services/convertApiTheme';

export const useGetThemeByProviderAndId = (
  provider: string,
  id: string,
): UseQueryResult<OpenstaxBook> => {
  const apiClient = useBoclipsClient();

  return useQuery([`book-${provider}`, id], () =>
    doGetThemeByProviderAndId(apiClient, provider, id),
  );
};

const doGetThemesByProvider = (
  client: BoclipsClient,
  provider: string,
): Promise<OpenstaxBook[]> => {
  return client.alignments
    .getThemesByProvider(provider)
    .then((themes) => themes.map((it) => convertApiTheme(it)));
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
) =>
  client.alignments
    .getThemeByProviderAndId(provider, id)
    .then((it) => convertApiTheme(it));

const doGetTypesByProvider = (client: BoclipsClient, provider: string) =>
  client.alignments.getAllTypesByProvider(provider);

export const useGetThemesByProviderQuery = (
  provider: string,
): UseQueryResult<OpenstaxBook[]> => {
  const client = useBoclipsClient();
  return useQuery(['themesByProvider', provider], () =>
    doGetThemesByProvider(client, provider),
  );
};
