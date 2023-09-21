import { render } from '@testing-library/react';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import React from 'react';
import { VideoLicensingDetails } from 'src/components/videoPage/videoLicensingDetails/VideoLicensingDetails';

describe('Video licensing details in video page', () => {
  it('displays Licensing Details title', () => {
    const video = VideoFactory.sample({});
    const wrapper = render(<VideoLicensingDetails video={video} />);

    expect(wrapper.getByText('Licensing Details')).toBeVisible();
  });

  it('displays Licensing Details section title', () => {
    const video = VideoFactory.sample({ maxLicenseDurationYears: 3 });
    const wrapper = render(<VideoLicensingDetails video={video} />);

    expect(wrapper.getByText('Maximum Licensing Term')).toBeVisible();
    expect(wrapper.getByText('3 years')).toBeVisible();
  });
});
