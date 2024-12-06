import { render } from '@testing-library/react';
import React from 'react';
import { VideoInfo } from '@components/common/videoInfo/VideoInfo';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { PlaybackFactory } from 'boclips-api-client/dist/test-support/PlaybackFactory';
import dayjs from 'dayjs';

describe('VideoInfo', () => {
  it('shows other video metadata', () => {
    const wrapper = render(
      <VideoInfo
        video={VideoFactory.sample({
          createdBy: 'Test User',
          id: '123',
          releasedOn: new Date('2023-10-23'),
        })}
      />,
    );

    expect(wrapper.getByText('23 Oct 2023')).toBeVisible();
    expect(wrapper.getByText('123')).toBeVisible();
    expect(wrapper.getByText('Test User')).toBeVisible();
  });

  describe('duration', () => {
    it('shows duration information of the video in minutes', () => {
      const wrapper = render(
        <VideoInfo
          video={VideoFactory.sample({
            playback: PlaybackFactory.sample({
              duration: dayjs.duration('PT1M39S'),
            }),
          })}
        />,
      );

      expect(wrapper.getByText('01:39')).toBeVisible();
    });

    it('shows duration information of the video in hours when longer than 60 mins', () => {
      const wrapper = render(
        <VideoInfo
          video={VideoFactory.sample({
            playback: PlaybackFactory.sample({
              duration: dayjs.duration('PT1H3M'),
            }),
          })}
        />,
      );

      expect(wrapper.getByText('1:03:00')).toBeVisible();
    });

    it('does not shows duration information when missing', () => {
      const wrapper = render(
        <VideoInfo
          video={VideoFactory.sample({
            playback: PlaybackFactory.sample({
              duration: undefined,
            }),
          })}
        />,
      );

      expect(wrapper.queryByTestId('duration')).not.toBeInTheDocument();
    });
  });
});
