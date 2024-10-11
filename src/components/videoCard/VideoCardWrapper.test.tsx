import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import React from 'react';
import { VideoCardWrapper } from 'src/components/videoCard/VideoCardWrapper';
import { PlaybackFactory } from 'boclips-api-client/dist/test-support/PlaybackFactory';
import { render } from 'src/testSupport/render';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { VideoInteractedWith } from 'boclips-api-client/dist/sub-clients/events/model/EventRequest';
import { act, fireEvent } from '@testing-library/react';
import Button from '@boclips-ui/button';
import { BoclipsClientProvider } from '../common/providers/BoclipsClientProvider';
import { BoclipsSecurityProvider } from '../common/providers/BoclipsSecurityProvider';

describe('Video card', () => {
  it('displays all the given information on a video card', async () => {
    const video = VideoFactory.sample({
      title: 'hello i am a title',
      description: 'wow what a video hansen',
      type: 'STOCK',
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
        type: 'STREAM',
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
          <VideoCardWrapper video={video} buttonsRow={null} />
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

  describe('buttons row', () => {
    const video = VideoFactory.sample({
      title: 'video killed the radio star',
    });

    it('renders whatever is passed through to button row in the video card', async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.videos.insertVideo(
        VideoFactory.sample({ id: '1', title: '1' }),
      );

      const wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={fakeClient}>
            <VideoCardWrapper
              video={video}
              buttonsRow={
                <Button aria-label="supplied-button-row" onClick={() => {}} />
              }
            />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );

      expect(
        await wrapper.findByRole('button', { name: 'supplied-button-row' }),
      ).toBeVisible();
    });
  });

  describe('video interacted with events', () => {
    it('sends an event when video details page is opened', async () => {
      const fakeClient = new FakeBoclipsClient();
      const video = VideoFactory.sample({
        title: 'video killed the radio star',
      });

      const wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={fakeClient}>
            <VideoCardWrapper video={video} buttonsRow={null} />
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
            <VideoCardWrapper
              video={video}
              buttonsRow={null}
              handleFilterChange={filterSpy}
            />
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
          <VideoCardWrapper
            video={video}
            buttonsRow={null}
            handleFilterChange={jest.fn()}
          />
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
          <VideoCardWrapper
            video={video}
            buttonsRow={null}
            handleFilterChange={jest.fn()}
          />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    expect(wrapper.queryByTestId('price-badge-container')).toBeNull();
  });
});
