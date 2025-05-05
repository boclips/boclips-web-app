import { fireEvent, render, waitFor } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router-dom';
import App from 'src/App';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import React from 'react';
import dayjs from 'dayjs';
import { Link } from 'boclips-api-client/dist/types';
import { LicensedContent } from 'boclips-api-client/dist/sub-clients/licenses/model/LicensedContent';
import userEvent from '@testing-library/user-event';
import { createBrowserHistory } from 'history';
import { lastEvent } from 'src/testSupport/lastEvent';

describe('Licenses view', () => {
  it('renders licenses tabs', async () => {
    const apiClient = new FakeBoclipsClient();

    const wrapper = render(
      <MemoryRouter initialEntries={['/licenses']}>
        <App apiClient={apiClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('My licenses')).toBeVisible();
  });

  it('loads the no content view (for now)', async () => {
    const apiClient = new FakeBoclipsClient();

    const wrapper = render(
      <MemoryRouter initialEntries={['/licenses']}>
        <App apiClient={apiClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(
      await wrapper.findByText('No results found for Licenses.'),
    ).toBeVisible();

    expect(
      wrapper.getByText(
        'You can track and review all licensed content once you have placed orders.',
      ),
    ).toBeInTheDocument();
  });

  it('displays licensed content', async () => {
    const apiClient = setupLicenses();
    const wrapper = render(
      <MemoryRouter initialEntries={['/content']}>
        <App apiClient={apiClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('My Licenses')).toBeVisible();
    expect(
      await wrapper.findByText(
        /Your Licenses from 31 March 2023 are available here. For any order prior to 31 March 2023 please reach out to/,
      ),
    ).toBeVisible();

    fireEvent.click(await wrapper.findByText('My licenses'));
    expect(await wrapper.findByText('video-title')).toBeVisible();
    expect(wrapper.getByText('Starting date:')).toBeVisible();
    expect(wrapper.getByText('11 Jan 2022')).toBeVisible();
    expect(wrapper.getByText('Expiry date:')).toBeVisible();
    expect(wrapper.getByText('11 Feb 2023')).toBeVisible();
    expect(wrapper.getByText('Order ID:')).toBeVisible();
    expect(wrapper.getByText('order-id')).toBeVisible();
  });

  it('can navigate between content pages', async () => {
    const apiClient = new FakeBoclipsClient();

    for (let videoNo = 1; videoNo <= 12; videoNo++) {
      apiClient.licenses.insert(contentItem(`video-${videoNo}`));
    }

    const wrapper = render(
      <MemoryRouter initialEntries={['/content']}>
        <App apiClient={apiClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('My Licenses')).toBeVisible();

    expect(await wrapper.findByText('video-1')).toBeVisible();
    expect(await wrapper.findByText('video-10')).toBeVisible();
    expect(wrapper.queryByText('video-11')).toBeNull();

    await userEvent.click(wrapper.getByText('Next'));

    expect(await wrapper.findByText('video-11')).toBeVisible();
    expect(await wrapper.findByText('video-12')).toBeVisible();
    expect(wrapper.queryByText('video-1')).toBeNull();
    expect(wrapper.queryByText('video-10')).toBeNull();

    await userEvent.click(wrapper.getByText('Prev'));

    expect(await wrapper.findByText('video-1')).toBeVisible();
    expect(await wrapper.findByText('video-10')).toBeVisible();
    expect(wrapper.queryByText('video-11')).toBeNull();
  });

  it('persists page between pages', async () => {
    const history = createBrowserHistory();
    history.push('/content');
    const apiClient = new FakeBoclipsClient();

    for (let videoNo = 1; videoNo <= 12; videoNo++) {
      apiClient.licenses.insert(contentItem(`video-${videoNo}`));
    }

    const wrapper = render(
      <Router location={history.location} navigator={history}>
        <App apiClient={apiClient} boclipsSecurity={stubBoclipsSecurity} />
      </Router>,
    );

    expect(await wrapper.findByText('My Licenses')).toBeVisible();

    await userEvent.click(wrapper.getByText('Next'));
    expect(history.location.search).toContain('?page=1');

    await userEvent.click(wrapper.getByText('Prev'));
    expect(history.location.search).toContain('?page=0');
  });

  it(`emits platform interacted with event on viewing info`, async () => {
    const apiClient = setupLicenses();

    const wrapper = render(
      <MemoryRouter initialEntries={['/content']}>
        <App apiClient={apiClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('My Licenses')).toBeVisible();
    await userEvent.hover(wrapper.getByTestId('content-info'));

    await waitFor(() => {
      expect(lastEvent(apiClient, 'PLATFORM_INTERACTED_WITH')).toEqual({
        type: 'PLATFORM_INTERACTED_WITH',
        subtype: 'MY_CONTENT_AREA_INFO_VIEWED',
        anonymous: false,
      });
    });
  });

  const contentItem = (videoTitle: string): LicensedContent => ({
    videoId: 'video-id',
    license: {
      id: 'license-id',
      userId: 'user-1',
      orderId: 'order-id',
      startDate: new Date('2022-01-11'),
      endDate: new Date('2023-02-11'),
    },
    videoMetadata: {
      title: videoTitle,
      channelName: 'channel-name',
      duration: dayjs.duration('PT112'),
      links: {
        self: new Link({ href: 'link', templated: false }),
      },
    },
  });

  const setupLicenses = () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.licenses.insert({
      videoId: 'id',
      license: {
        id: 'video-id',
        userId: 'user-1',
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

    return apiClient;
  };
});
