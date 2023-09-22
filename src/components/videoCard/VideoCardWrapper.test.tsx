import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import React from 'react';
import { VideoCardWrapper } from 'src/components/videoCard/VideoCardWrapper';
import { PlaybackFactory } from 'boclips-api-client/dist/test-support/PlaybackFactory';
import { render } from 'src/testSupport/render';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { VideoInteractedWith } from 'boclips-api-client/dist/sub-clients/events/model/EventRequest';
import { act, fireEvent, waitFor } from '@testing-library/react';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { HotjarEvents } from 'src/services/analytics/hotjar/Events';
import { BoclipsClientProvider } from '../common/providers/BoclipsClientProvider';
import { BoclipsSecurityProvider } from '../common/providers/BoclipsSecurityProvider';

describe('Video card', () => {
  it('displays all the given information on a video card', async () => {
    const video = VideoFactory.sample({
      title: 'hello i am a title',
      description: 'wow what a video hansen',
      types: [{ id: 0, name: 'Stock' }],
      ageRange: {
        min: 7,
        max: 9,
      },
      releasedOn: new Date('2019-03-20'),
      createdBy: 'BFI',
      subjects: [
        {
          id: '123',
          name: 'geography',
        },
      ],
      playback: PlaybackFactory.sample({
        type: 'YOUTUBE',
      }),
      price: {
        amount: 100,
        currency: 'USD',
      },
      educationLevels: [
        { code: 'EL1', label: 'EL1-label' },
        { code: 'EL2', label: 'EL2-label' },
      ],
    });

    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <VideoCardWrapper video={video} />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    expect(await wrapper.findByText('hello i am a title')).toBeVisible();
    expect(wrapper.getByText('wow what a video hansen')).toBeVisible();
    expect(wrapper.getByText('20 Mar 2019')).toBeVisible();
    expect(wrapper.getByText('BFI')).toBeVisible();
    expect(wrapper.getByText('geography')).toBeVisible();
    expect(wrapper.queryByText(/Ages/)).toBeNull();
    expect(wrapper.getByText('$100')).toBeVisible();
    expect(wrapper.getByText('EL1-label')).toBeVisible();
    expect(wrapper.getByText('EL2-label')).toBeVisible();
  });

  describe('copy link buttons', () => {
    const video = VideoFactory.sample({
      title: 'video killed the radio star',
    });

    it('shows copy video link in the video card', async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.videos.insertVideo(
        VideoFactory.sample({ id: '1', title: '1' }),
      );

      const wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={fakeClient}>
            <VideoCardWrapper video={video} />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );

      expect(await wrapper.findByLabelText('Copy video link')).toBeVisible();
    });

    it('does not show copy video id for non boclips users', async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.videos.insertVideo(
        VideoFactory.sample({ id: '1', title: '1' }),
      );

      fakeClient.users.insertCurrentUser(
        UserFactory.sample({
          organisation: { id: 'org-1', name: 'Anything but boclips' },
        }),
      );

      const wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={fakeClient}>
            <VideoCardWrapper video={video} />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );

      expect(await wrapper.findByLabelText('Copy video link')).toBeVisible();
      expect(wrapper.queryByLabelText('Copy video id')).not.toBeInTheDocument();
    });

    it('does show copy video id button for boclips users', async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.videos.insertVideo(
        VideoFactory.sample({ id: '1', title: '1' }),
      );

      fakeClient.users.insertCurrentUser(
        UserFactory.sample({
          features: { BO_WEB_APP_COPY_VIDEO_ID_BUTTON: true },
          organisation: { id: 'org-bo', name: 'Boclips' },
        }),
      );

      const wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={fakeClient}>
            <VideoCardWrapper video={video} />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );

      expect(await wrapper.findByLabelText('Copy video link')).toBeVisible();
      expect(await wrapper.findByLabelText('Copy video id')).toBeVisible();
    });
  });

  describe('add to playlist button', () => {
    const video = VideoFactory.sample({
      title: 'video killed the radio star',
    });

    it('can add video to a playlist', async () => {
      const fakeClient = new FakeBoclipsClient();

      fakeClient.users.insertCurrentUser(UserFactory.sample());

      fakeClient.collections.setCurrentUser('i-am-user-id');
      fakeClient.collections.addToFake(
        CollectionFactory.sample({
          id: 'playlist-id',
          title: 'first playlist',
          origin: 'BO_WEB_APP',
          owner: 'i-am-user-id',
        }),
      );

      const wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={fakeClient}>
            <VideoCardWrapper video={video} />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );

      fireEvent.click(await wrapper.findByLabelText('Add to playlist'));

      const checkbox = await wrapper.findByRole('checkbox');
      fireEvent.click(checkbox);

      await waitFor(async () => {
        expect(await wrapper.findByRole('checkbox')).toHaveProperty(
          'checked',
          true,
        );
      });
    });

    it('can remove video from a playlist', async () => {
      const fakeClient = new FakeBoclipsClient();

      fakeClient.users.insertCurrentUser(UserFactory.sample());

      fakeClient.collections.setCurrentUser('i-am-user-id');
      fakeClient.collections.addToFake(
        CollectionFactory.sample({
          id: 'playlist-id',
          title: 'first playlist',
          origin: 'BO_WEB_APP',
          owner: 'i-am-user-id',
          videos: [VideoFactory.sample({ id: video.id })],
        }),
      );

      const wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={fakeClient}>
            <VideoCardWrapper video={video} />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );

      await waitFor(() =>
        wrapper.getByLabelText('Add or remove from playlist'),
      ).then((it) => {
        fireEvent.click(it);
      });

      fireEvent.click(wrapper.getByText('first playlist'));

      await waitFor(() => wrapper.getByRole('checkbox')).then((it) => {
        expect(it).toHaveProperty('checked', false);
      });
    });

    it('can add video to a playlist when having a lot of them', async () => {
      const fakeClient = new FakeBoclipsClient();

      fakeClient.users.insertCurrentUser(UserFactory.sample());

      fakeClient.collections.setCurrentUser('i-am-user-id');

      // fake client default pageSize is 10
      for (let i = 0; i <= 20; i++) {
        fakeClient.collections.addToFake(
          CollectionFactory.sample({
            id: `playlist-${i}`,
            title: `playlist ${i}`,
            origin: 'BO_WEB_APP',
            owner: 'i-am-user-id',
          }),
        );
      }

      const wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={fakeClient}>
            <VideoCardWrapper video={video} />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );

      fireEvent.click(await wrapper.findByLabelText('Add to playlist'));

      const checkbox = await wrapper.findByRole('checkbox', {
        name: 'playlist 15',
      });
      fireEvent.click(checkbox);

      await waitFor(async () => {
        expect(
          await wrapper.findByRole('checkbox', { name: 'playlist 15' }),
        ).toHaveProperty('checked', true);
      });
    });
  });

  describe('video interacted with events', () => {
    it('add to cart button sends event when toggled', async () => {
      const fakeClient = new FakeBoclipsClient();
      const wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={fakeClient}>
            <VideoCardWrapper video={VideoFactory.sample({})} />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );

      const addToCart = await wrapper.findByRole('button', {
        name: 'Add to cart',
      });

      act(() => {
        fireEvent.click(addToCart);
      });

      const videoInteractedEvents =
        fakeClient.events.getEvents() as VideoInteractedWith[];

      expect(videoInteractedEvents.length).toEqual(1);
      expect(videoInteractedEvents[0].type).toEqual('VIDEO_INTERACTED_WITH');
      expect(videoInteractedEvents[0].subtype).toEqual('VIDEO_ADDED_TO_CART');

      const removeFromCart = await wrapper.findByText('Remove');

      act(() => {
        fireEvent.click(removeFromCart);
      });

      expect(videoInteractedEvents.length).toEqual(2);
      expect(videoInteractedEvents[1].type).toEqual('VIDEO_INTERACTED_WITH');
      expect(videoInteractedEvents[1].subtype).toEqual(
        'VIDEO_REMOVED_FROM_CART',
      );
    });

    it('sends a hotjar addToCart event', async () => {
      const apiClient = new FakeBoclipsClient();

      const hotjarEventAddedToCart = jest.spyOn(
        AnalyticsFactory.hotjar(),
        'event',
      );

      const wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={apiClient}>
            <VideoCardWrapper video={VideoFactory.sample({})} />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );

      const addToCartButton = await wrapper.findByText('Add to cart');

      fireEvent.click(addToCartButton);

      await waitFor(() =>
        expect(hotjarEventAddedToCart).toHaveBeenCalledWith(
          HotjarEvents.AddToCartFromVideoCard,
        ),
      );
    });

    it('sends an event when video details page is opened', async () => {
      const fakeClient = new FakeBoclipsClient();
      const video = VideoFactory.sample({
        title: 'video killed the radio star',
      });

      const wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={fakeClient}>
            <VideoCardWrapper video={video} />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );

      const title = await wrapper.findByText('video killed the radio star');

      act(() => {
        fireEvent.click(title);
      });

      const videoInteractedEvent =
        fakeClient.events.getEvents()[0] as VideoInteractedWith;

      expect(videoInteractedEvent.type).toEqual('VIDEO_INTERACTED_WITH');
      expect(videoInteractedEvent.subtype).toEqual('NAVIGATE_TO_VIDEO_DETAILS');
    });
  });

  describe(`createdBy link`, () => {
    it(`renders a clickable link in createdBy element`, () => {
      const video = VideoFactory.sample({
        createdBy: 'Amazing content partner',
        channelId: '123',
      });
      const filterSpy = jest.fn();

      const wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={new FakeBoclipsClient()}>
            <VideoCardWrapper video={video} handleFilterChange={filterSpy} />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );

      fireEvent.click(wrapper.getByText('Amazing content partner'));

      expect(filterSpy).toHaveBeenCalledWith('channel', ['123']);
    });
  });
});

describe(`PriceBadge`, () => {
  it(`renders a price badge when price is defined`, () => {
    const video = VideoFactory.sample({
      price: { amount: 100, currency: 'USD' },
    });

    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <VideoCardWrapper video={video} handleFilterChange={jest.fn()} />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    expect(wrapper.getByText('$100')).toBeVisible();
  });

  it(`does not render a price badge container when price is not defined`, () => {
    const video = VideoFactory.sample({
      price: undefined,
    });

    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <VideoCardWrapper video={video} handleFilterChange={jest.fn()} />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    expect(wrapper.queryByTestId('price-badge-container')).toBeNull();
  });
});
