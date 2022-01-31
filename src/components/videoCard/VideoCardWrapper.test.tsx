import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import React from 'react';
import { VideoCardWrapper } from 'src/components/videoCard/VideoCardWrapper';
import { PlaybackFactory } from 'boclips-api-client/dist/test-support/PlaybackFactory';
import { render } from 'src/testSupport/render';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { VideoInteractedWith } from 'boclips-api-client/dist/sub-clients/events/model/EventRequest';
import { act, fireEvent } from '@testing-library/react';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
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
    expect(wrapper.queryByText('Ages 7-9')).not.toBeInTheDocument();
    expect(wrapper.getByText('$100')).toBeVisible();
  });

  describe('video card elements', () => {
    describe('video card buttons', () => {
      const video = VideoFactory.sample({
        title: 'video killed the radio star',
      });

      it('displays playlist button', async () => {
        const fakeClient = new FakeBoclipsClient();

        fakeClient.users.insertCurrentUser(
          UserFactory.sample({
            features: { BO_WEB_APP_ENABLE_PLAYLISTS: true },
          }),
        );

        const wrapper = render(
          <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
            <BoclipsClientProvider client={fakeClient}>
              <VideoCardWrapper video={video} />
            </BoclipsClientProvider>
          </BoclipsSecurityProvider>,
        );

        expect(
          await wrapper.findByLabelText('Add to playlist'),
        ).toBeInTheDocument();
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

      it('does not show copy legacy video link for non boclips users', async () => {
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
        expect(
          wrapper.queryByLabelText('Copy legacy video link'),
        ).not.toBeInTheDocument();
      });

      it('does show copy legacy link button for boclips users', async () => {
        const fakeClient = new FakeBoclipsClient();
        fakeClient.videos.insertVideo(
          VideoFactory.sample({ id: '1', title: '1' }),
        );

        fakeClient.users.insertCurrentUser(
          UserFactory.sample({
            features: { BO_WEB_APP_COPY_OLD_LINK_BUTTON: true },
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
        expect(
          await wrapper.findByLabelText('Copy legacy video link'),
        ).toBeVisible();
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

      const videoInteractedEvents = fakeClient.events.getEvents() as VideoInteractedWith[];

      expect(videoInteractedEvents.length).toEqual(1);
      expect(videoInteractedEvents[0].type).toEqual('VIDEO_INTERACTED_WITH');
      expect(videoInteractedEvents[0].subtype).toEqual('VIDEO_ADDED_TO_CART');

      const removeFromCart = await wrapper.findByRole('button', {
        name: 'Remove',
      });

      act(() => {
        fireEvent.click(removeFromCart);
      });

      expect(videoInteractedEvents.length).toEqual(2);
      expect(videoInteractedEvents[1].type).toEqual('VIDEO_INTERACTED_WITH');
      expect(videoInteractedEvents[1].subtype).toEqual(
        'VIDEO_REMOVED_FROM_CART',
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

      const videoInteractedEvent = fakeClient.events.getEvents()[0] as VideoInteractedWith;

      expect(videoInteractedEvent.type).toEqual('VIDEO_INTERACTED_WITH');
      expect(videoInteractedEvent.subtype).toEqual('NAVIGATE_TO_VIDEO_DETAILS');
    });
  });
});
