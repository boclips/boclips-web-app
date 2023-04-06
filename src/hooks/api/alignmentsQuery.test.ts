import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import {
  useGetProvidersQuery,
  useGetThemeByProviderAndId,
  useGetThemesByProviderQuery,
} from 'src/hooks/api/alignmentsQuery';
import { renderHook } from '@testing-library/react-hooks';
import { wrapperWithClients } from 'src/testSupport/wrapper';
import { QueryClient } from '@tanstack/react-query';
import { ThemeFactory } from 'boclips-api-client/dist/test-support/ThemeFactory';

describe('AlignmentsQuery', () => {
  it('gets theme by provider and by id', async () => {
    const fakeClient = new FakeBoclipsClient();

    const theme = ThemeFactory.sample({
      provider: 'openstax',
      title: 'The history of art',
      id: 'art-history-id',
    });

    fakeClient.alignments.setThemesByProvider({
      providerName: 'openstax',
      themes: [theme],
    });

    const themeHook = renderHook(
      () => useGetThemeByProviderAndId('openstax', 'art-history-id'),
      {
        wrapper: wrapperWithClients(fakeClient, new QueryClient()),
      },
    );

    await themeHook.waitFor(() => themeHook.result.current.isSuccess);

    expect(themeHook.result.current.data.id).toEqual('art-history-id');
    expect(themeHook.result.current.data.title).toEqual('The history of art');
  });

  it('gets all themes', async () => {
    const fakeClient = new FakeBoclipsClient();

    const themes = [ThemeFactory.sample({ id: 'id-1' })];
    fakeClient.alignments.setThemesByProvider({
      providerName: 'openstax',
      themes,
    });

    const getThemesHook = renderHook(
      () => useGetThemesByProviderQuery('openstax'),
      {
        wrapper: wrapperWithClients(fakeClient, new QueryClient()),
      },
    );

    await getThemesHook.waitFor(() => getThemesHook.result.current.isSuccess);
    const result = getThemesHook.result.current.data;

    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual('id-1');
  });

  it('gets all providers', async () => {
    const fakeClient = new FakeBoclipsClient();

    fakeClient.alignments.setProviders([
      {
        name: 'OpenStax',
        types: ['Math', 'Science'],
        description: 'this is openstax',
        logoUrl: 'https://logo.com',
        defaultThemeLogoUrl: 'https://default.logo.com',
        navigationPath: 'openstax',
      },
      {
        name: 'NGSS',
        types: ['Math', 'Science'],
        description: 'this is ngss',
        logoUrl: 'https://logo.com',
        defaultThemeLogoUrl: 'https://default.logo.com',
        navigationPath: 'ngss',
      },
    ]);

    const hook = renderHook(() => useGetProvidersQuery(), {
      wrapper: wrapperWithClients(fakeClient, new QueryClient()),
    });

    await hook.waitFor(() => hook.result.current.isFetched);
    const result = hook.result.current.data;

    expect(result).toHaveLength(2);
    expect(result[0].name).toEqual('OpenStax');
    expect(result[1].name).toEqual('NGSS');
  });

  it('gets provider themes', async () => {
    const fakeClient = new FakeBoclipsClient();
    const openstax = [
      ThemeFactory.sample({ id: '1', provider: 'openstax' }),
      ThemeFactory.sample({ id: '2', provider: 'openstax' }),
    ];

    const ngss = [ThemeFactory.sample({ id: '3', provider: 'ngss' })];

    fakeClient.alignments.setThemesByProvider(
      {
        providerName: 'openstax',
        themes: openstax,
      },
      {
        providerName: 'ngss',
        themes: ngss,
      },
    );

    const result = await fakeClient.alignments.getThemesByProvider('openstax');

    expect(result).toHaveLength(2);
    expect(result[0].id).toEqual('1');
    expect(result[1].id).toEqual('2');
  });
});
