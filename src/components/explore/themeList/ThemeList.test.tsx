import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render } from 'src/testSupport/render';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import React from 'react';
import { ThemeList } from 'src/components/explore/themeList/ThemeList';
import { OpenstaxBookFactory } from 'src/testSupport/OpenstaxBookFactory';
import { AlignmentContextProvider } from 'src/components/common/providers/AlignmentContextProvider';
import { getProviderByName } from 'src/views/openstax/provider/AlignmentProviderFactory';

describe('Theme list', () => {
  it(`displays all themes`, async () => {
    const fakeClient = new FakeBoclipsClient();

    const themes = [
      OpenstaxBookFactory.sample({ title: 'Maths' }),
      OpenstaxBookFactory.sample({ title: 'Physics' }),
    ];

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <AlignmentContextProvider provider={getProviderByName('openstax')}>
          <ThemeList themes={themes} isLoading={false} />
        </AlignmentContextProvider>
      </BoclipsClientProvider>,
    );

    expect(await wrapper.findByText('Maths')).toBeInTheDocument();
    expect(wrapper.getByText('Physics')).toBeInTheDocument();
  });

  it(`themes without chapters are hidden`, async () => {
    const fakeClient = new FakeBoclipsClient();

    const themes = [
      OpenstaxBookFactory.sample({ provider: 'openstax', title: 'Maths' }),
      OpenstaxBookFactory.sample({
        provider: 'openstax',
        title: 'Physics',
        topics: [],
      }),
    ];

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <AlignmentContextProvider provider={getProviderByName('openstax')}>
          <ThemeList themes={themes} isLoading={false} />
        </AlignmentContextProvider>
      </BoclipsClientProvider>,
    );

    expect(await wrapper.findByText('Maths')).toBeInTheDocument();
    expect(wrapper.queryByText('Physics')).toBeNull();
  });

  it(`displays themes skeleton`, async () => {
    const fakeClient = new FakeBoclipsClient();

    const themes = [
      OpenstaxBookFactory.sample({ title: 'Maths' }),
      OpenstaxBookFactory.sample({ title: 'Physics' }),
    ];

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <AlignmentContextProvider provider={getProviderByName('openstax')}>
          <ThemeList themes={themes} isLoading />
        </AlignmentContextProvider>
      </BoclipsClientProvider>,
    );

    expect(
      await wrapper.findByTestId('theme-card-skeleton-1'),
    ).toBeInTheDocument();

    expect(
      await wrapper.findByTestId('theme-card-skeleton-2'),
    ).toBeInTheDocument();
  });
});
