import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import App from 'src/App';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { setUpClientWithTheme } from 'src/views/alignments/theme/ThemeTestSupport';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { Theme } from 'boclips-api-client/dist/sub-clients/alignments/model/theme/Theme';
import { ThemeFactory } from 'boclips-api-client/dist/test-support/ThemeFactory';

describe('ThemeView - accessibility', () => {
  it('has no violations', async () => {
    const theme: Theme = ThemeFactory.sample({
      id: 'ducklings',
      provider: 'openstax',
      title: 'Everything to know about ducks',
      type: 'Essentials',
      topics: [
        {
          title: 'Chapter 1: Introduction',
          index: 0,
          targets: [
            {
              title: '1.1 Section 1',
              index: 0,
              videos: [
                VideoFactory.sample({
                  id: '1',
                  title: 'The best video ever',
                  createdBy: 'TED',
                }),
              ],
              videoIds: ['1'],
            },
            {
              title: '1.2 Section 2',
              index: 1,
              videos: [
                VideoFactory.sample({
                  id: '2',
                  title: 'The best video ever',
                  createdBy: 'TED',
                }),
              ],
              videoIds: ['2'],
            },
          ],
        },
        {
          title: 'Chapter 2: Epilogue',
          index: 1,
          targets: [
            {
              title: '2.1 Section 1',
              index: 0,
              videos: [
                VideoFactory.sample({
                  id: '3',
                  title: 'The best video ever',
                  createdBy: 'TED',
                }),
              ],
              videoIds: ['3'],
            },
            {
              title: '2.2 Section 2',
              index: 1,
              videos: [
                VideoFactory.sample({
                  id: '4',
                  title: 'The best video ever',
                  createdBy: 'TED',
                }),
              ],
              videoIds: ['4'],
            },
          ],
        },
      ],
    });
    const client = setUpClientWithTheme(theme);

    const history = createBrowserHistory();
    history.push('/alignments/openstax/ducklings');

    const wrapper = render(
      <Router location={history.location} navigator={history}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </Router>,
    );

    expect(
      await wrapper.findByLabelText(
        `Content for Everything to know about ducks`,
      ),
    ).toBeVisible();

    const results = await axe(wrapper.container);

    expect(results).toHaveNoViolations();
  });
});
