import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import React from 'react';
import { render } from 'src/testSupport/render';
import VideoLicenseDuration from 'src/components/common/videoLicenseDuration/VideoLicenseDuration';

describe('video license duration', () => {
  it('displays nothing when license duration is not set', async () => {
    const video = VideoFactory.sample({ maxLicenseDurationYears: undefined });
    const wrapper = render(<VideoLicenseDuration video={video} />);

    expect(wrapper.container.firstChild).toBeNull();
  });

  it('displays information about license duration under 10 years', async () => {
    const video = VideoFactory.sample({ maxLicenseDurationYears: 8 });
    const wrapper = render(<VideoLicenseDuration video={video} />);

    expect(
      wrapper.getByText('Can be licensed for a maximum of 8 years'),
    ).toBeVisible();
  });

  it('displays information about license duration equal 10 years', async () => {
    const video = VideoFactory.sample({ maxLicenseDurationYears: 10 });
    const wrapper = render(<VideoLicenseDuration video={video} />);

    expect(wrapper.getByText('Can be licensed for 10+ years')).toBeVisible();
  });

  it('displays information about license duration equal 1 year', async () => {
    const video = VideoFactory.sample({ maxLicenseDurationYears: 1 });
    const wrapper = render(<VideoLicenseDuration video={video} />);

    expect(
      wrapper.getByText('Can be licensed for a maximum of 1 year'),
    ).toBeVisible();
  });

  it('displays information about license duration above 10 years', async () => {
    const video = VideoFactory.sample({ maxLicenseDurationYears: 11 });
    const wrapper = render(<VideoLicenseDuration video={video} />);

    expect(wrapper.getByText('Can be licensed for 10+ years')).toBeVisible();
  });
});
