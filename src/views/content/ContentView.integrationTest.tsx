import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import React from 'react';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import dayjs from 'dayjs';
import { Link } from 'boclips-api-client/dist/types';

describe('ContentView', () => {
  it('loads the no content view (for now)', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.users.insertCurrentUser(
      UserFactory.sample({
        features: { BO_WEB_APP_DEV: true },
      }),
    );

    const wrapper = render(
      <MemoryRouter initialEntries={['/content']}>
        <App apiClient={apiClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('My Content Area')).toBeVisible();

    expect(
      wrapper.getByText('You have no licensed content... yet!'),
    ).toBeVisible();
    expect(wrapper.getByText('This is just a placeholder')).toBeInTheDocument();
  });

  it('displays licensed content', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.licenses.insert({
      videoId: 'id',
      license: {
        id: 'video-id',
        orderId: 'order-id',
        startDate: new Date('2022-01-11'),
        endDate: new Date('2023-02-11'),
      },
      videoMetadata: {
        title: 'video-title',
        channelName: 'channel-name',
        duration: dayjs.duration('PT112'),
        links: {
          self: new Link({ href: 'link', templated: false }),
        },
      },
    });

    apiClient.users.insertCurrentUser(
      UserFactory.sample({
        features: { BO_WEB_APP_DEV: true },
      }),
    );

    const wrapper = render(
      <MemoryRouter initialEntries={['/content']}>
        <App apiClient={apiClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('My Content Area')).toBeVisible();

    expect(await wrapper.findByText('video-title')).toBeVisible();
    expect(wrapper.getByText('Starting date:')).toBeVisible();
    expect(wrapper.getByText('11 Jan 2022')).toBeVisible();
    expect(wrapper.getByText('Expiry date:')).toBeVisible();
    expect(wrapper.getByText('11 Feb 2023')).toBeVisible();
    expect(wrapper.getByText('Order ID:')).toBeVisible();
    expect(wrapper.getByText('order-id')).toBeVisible();
  });
});
