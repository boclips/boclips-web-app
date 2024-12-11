import { ThemeCard } from '@components/alignments/explore/themeList/ThemeCard';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { ProviderFactory } from '@src/views/alignments/provider/ProviderFactory';
import { AlignmentContextProvider } from '@components/common/providers/AlignmentContextProvider';
import {
  TargetFactory,
  ThemeFactory,
  TopicFactory,
} from 'boclips-api-client/dist/test-support/ThemeFactory';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('ThemeCard', () => {
  it('shows theme title and number of videos', async () => {
    const theme = ThemeFactory.sample({
      title: 'Olive trees',
      logoUrl: 'svg.com',
      topics: [
        TopicFactory.sample({
          targets: [
            TargetFactory.sample({
              videoIds: ['1', '2'],
            }),
          ],
        }),
      ],
    });

    const history = createBrowserHistory();

    const wrapper = render(
      <Router location={history.location} navigator={history}>
        <AlignmentContextProvider provider={ProviderFactory.sample('openstax')}>
          <BoclipsClientProvider client={new FakeBoclipsClient()}>
            <QueryClientProvider client={new QueryClient()}>
              <ThemeCard theme={theme} />
            </QueryClientProvider>
          </BoclipsClientProvider>
        </AlignmentContextProvider>
      </Router>,
    );
    const card = await wrapper.findByRole('button', {
      name: 'theme Olive trees',
    });
    expect(card).toHaveTextContent('Olive trees');
    expect(card).toHaveTextContent('2 videos');
    expect(wrapper.getByAltText('Olive trees cover')).toBeInTheDocument();
  });

  it('shows theme cover when logo url is present', async () => {
    const theme = ThemeFactory.sample({
      title: 'Olive trees',
      logoUrl: 'svg.com',
    });

    const history = createBrowserHistory();

    const wrapper = render(
      <Router location={history.location} navigator={history}>
        <AlignmentContextProvider provider={ProviderFactory.sample('openstax')}>
          <BoclipsClientProvider client={new FakeBoclipsClient()}>
            <QueryClientProvider client={new QueryClient()}>
              <ThemeCard theme={theme} />
            </QueryClientProvider>
          </BoclipsClientProvider>
        </AlignmentContextProvider>
      </Router>,
    );
    expect(
      await wrapper.findByAltText('Olive trees cover'),
    ).toBeInTheDocument();
  });

  it('shows generic theme cover when logo url is not present', async () => {
    const theme = ThemeFactory.sample({
      title: 'Olive trees',
      logoUrl: '',
    });

    const history = createBrowserHistory();

    const wrapper = render(
      <Router location={history.location} navigator={history}>
        <AlignmentContextProvider provider={ProviderFactory.sample('openstax')}>
          <BoclipsClientProvider client={new FakeBoclipsClient()}>
            <QueryClientProvider client={new QueryClient()}>
              <ThemeCard theme={theme} />
            </QueryClientProvider>
          </BoclipsClientProvider>
        </AlignmentContextProvider>
      </Router>,
    );
    expect(
      await wrapper.findByAltText('Olive trees generic cover'),
    ).toBeInTheDocument();
  });

  it(`routes to the theme's page under alignments when clicked`, async () => {
    const history = createBrowserHistory();
    history.push('/alignments/openstax');

    const fakeClient = new FakeBoclipsClient();
    const theme = ThemeFactory.sample({ title: 'openstax theme' });
    fakeClient.alignments.setThemesByProvider({
      providerName: 'openstax',
      themes: [theme],
    });
    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <QueryClientProvider client={new QueryClient()}>
          <Router location={history.location} navigator={history}>
            <AlignmentContextProvider
              provider={ProviderFactory.sample('openstax')}
            >
              <ThemeCard theme={theme} />
            </AlignmentContextProvider>
          </Router>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    (await wrapper.findByText('openstax theme')).click();
    expect(history.location.pathname).toEqual(
      `/alignments/openstax/${theme.id}`,
    );
  });

  describe('a11y', () => {
    it('focuses main when esc is pressed', async () => {
      const theme = ThemeFactory.sample({
        title: 'Olive trees',
        logoUrl: 'svg.com',
        topics: [
          TopicFactory.sample({
            targets: [
              TargetFactory.sample({
                videoIds: ['1', '2'],
              }),
            ],
          }),
        ],
      });

      const history = createBrowserHistory();

      const wrapper = render(
        <Router location={history.location} navigator={history}>
          <main tabIndex={-1}>this is main</main>
          <AlignmentContextProvider
            provider={ProviderFactory.sample('openstax')}
          >
            <BoclipsClientProvider client={new FakeBoclipsClient()}>
              <QueryClientProvider client={new QueryClient()}>
                <ThemeCard theme={theme} />
              </QueryClientProvider>
            </BoclipsClientProvider>
          </AlignmentContextProvider>
        </Router>,
      );

      await userEvent.tab();

      waitFor(() => {
        expect(wrapper.getByLabelText(`theme ${theme.title}`)).toHaveFocus();
      });

      await userEvent.type(
        wrapper.getByLabelText(`theme ${theme.title}`),
        '{esc}',
      );

      expect(wrapper.getByRole('main')).toHaveFocus();
    });
  });
});
