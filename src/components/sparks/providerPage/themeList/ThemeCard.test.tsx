import { ThemeCard } from 'src/components/sparks/providerPage/themeList/ThemeCard';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { getProviderByName } from 'src/views/alignments/provider/AlignmentProviderFactory';
import { AlignmentContextProvider } from 'src/components/common/providers/AlignmentContextProvider';
import {
  TargetFactory,
  ThemeFactory,
  TopicFactory,
} from 'boclips-api-client/dist/test-support/ThemeFactory';

describe('ThemeCard', () => {
  it('shows theme title and number of videos', () => {
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
        <AlignmentContextProvider provider={getProviderByName('openstax')}>
          <ThemeCard theme={theme} />
        </AlignmentContextProvider>
      </Router>,
    );
    const card = wrapper.getByRole('button', { name: 'theme Olive trees' });
    expect(card).toHaveTextContent('Olive trees');
    expect(card).toHaveTextContent('2 videos');
    expect(wrapper.getByAltText('Olive trees cover')).toBeInTheDocument();
  });

  it('shows theme cover when logo url is present', () => {
    const theme = ThemeFactory.sample({
      title: 'Olive trees',
      logoUrl: 'svg.com',
    });

    const history = createBrowserHistory();

    const wrapper = render(
      <Router location={history.location} navigator={history}>
        <AlignmentContextProvider provider={getProviderByName('openstax')}>
          <ThemeCard theme={theme} />
        </AlignmentContextProvider>
      </Router>,
    );
    expect(wrapper.getByAltText('Olive trees cover')).toBeInTheDocument();
  });

  it('shows generic theme cover when logo url is not present', () => {
    const theme = ThemeFactory.sample({
      title: 'Olive trees',
      logoUrl: '',
    });

    const history = createBrowserHistory();

    const wrapper = render(
      <Router location={history.location} navigator={history}>
        <AlignmentContextProvider provider={getProviderByName('openstax')}>
          <ThemeCard theme={theme} />
        </AlignmentContextProvider>
      </Router>,
    );
    expect(
      wrapper.getByAltText('Olive trees generic cover'),
    ).toBeInTheDocument();
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
          <AlignmentContextProvider provider={getProviderByName('openstax')}>
            <ThemeCard theme={theme} />
          </AlignmentContextProvider>
        </Router>,
      );

      await userEvent.tab();

      expect(wrapper.getByLabelText(`theme ${theme.title}`)).toHaveFocus();

      fireEvent.keyDown(wrapper.getByLabelText(`theme ${theme.title}`), {
        key: 'Escape',
      });

      expect(wrapper.getByRole('main')).toHaveFocus();
    });
  });
});
