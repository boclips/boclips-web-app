import React from 'react';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { PlaybackFactory } from 'boclips-api-client/dist/test-support/PlaybackFactory';
import { render } from 'src/testSupport/render';
import { fireEvent } from '@testing-library/react';
import { LazyVideoPlayer } from './LazyVideoPlayer';

describe('LazyVideoPlayer', () => {
  const video = VideoFactory.sample({
    title: 'Test video',
    playback: PlaybackFactory.sample({ type: 'STREAM' }),
  });

  it('shows a thumbnail and play button initially, not the player', () => {
    const { getByRole, queryByRole } = render(
      <LazyVideoPlayer video={video} showDurationBadge />,
    );

    expect(getByRole('button', { name: 'Play Test video' })).toBeVisible();
    expect(queryByRole('img')).toBeNull();
  });

  it('shows the duration badge when showDurationBadge is set', () => {
    const { getByText } = render(
      <LazyVideoPlayer video={video} showDurationBadge />,
    );

    expect(getByText('18:39')).toBeVisible();
  });

  it('does not show the duration badge when showDurationBadge is not set', () => {
    const { queryByText } = render(<LazyVideoPlayer video={video} />);

    expect(queryByText('18:39')).toBeNull();
  });

  it('mounts the player when the play button is clicked', () => {
    const { getByRole, queryByRole, getByTestId } = render(
      <LazyVideoPlayer video={video} showDurationBadge />,
    );

    fireEvent.click(getByRole('button', { name: 'Play Test video' }));

    expect(queryByRole('button', { name: 'Play Test video' })).toBeNull();
    expect(getByTestId('player')).toBeInTheDocument();
  });
});
