import React from 'react';
import { render } from '@testing-library/react';
import AlignmentCard from 'src/components/alignments/widget/card/AlignmentCard';
import { ProviderFactory } from 'src/views/alignments/provider/ProviderFactory';
import { MemoryRouter, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('Alignment card', () => {
  it('displays the provider name', async () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/alignments']}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <QueryClientProvider client={new QueryClient()}>
            <AlignmentCard provider={ProviderFactory.sample('openstax')} />
          </QueryClientProvider>
        </BoclipsClientProvider>
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('OpenStax')).toBeVisible();
  });

  it('displays the provider description', async () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/alignments']}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <QueryClientProvider client={new QueryClient()}>
            <AlignmentCard provider={ProviderFactory.sample('openstax')} />,
          </QueryClientProvider>
        </BoclipsClientProvider>
      </MemoryRouter>,
    );

    expect(
      await wrapper.findByText(
        'Explore our video library, expertly curated for your ebook',
      ),
    );
  });

  it('displays the provider logo', async () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/alignments']}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <QueryClientProvider client={new QueryClient()}>
            <AlignmentCard provider={ProviderFactory.sample('openstax')} />
          </QueryClientProvider>
        </BoclipsClientProvider>
      </MemoryRouter>,
    );

    expect(await wrapper.findByAltText(`OpenStax logo`)).toBeVisible();
  });

  it(`routes to the provider's page under alignments when clicked`, async () => {
    const history = createBrowserHistory();
    history.push('/alignments');
    const fakeClient = new FakeBoclipsClient();

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <QueryClientProvider client={new QueryClient()}>
          <Router location={history.location} navigator={history}>
            <AlignmentCard provider={ProviderFactory.sample('openstax')} />
          </Router>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    (await wrapper.findByText('OpenStax')).click();
    expect(history.location.pathname).toEqual('/alignments/openstax');
  });
});
