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

  it('displays max license duration', () => {
    const video = VideoFactory.sample({ maxLicenseDurationYears: 3 });
    const wrapper = render(<VideoLicensingDetails video={video} />);

    expect(wrapper.getByText('Maximum Licensing Term')).toBeVisible();
    expect(wrapper.getByText('3 years')).toBeVisible();
  });

  it('displays ALLOWED editing restriction', async () => {
    const video = VideoFactory.sample({
      restrictions: { editing: { permission: 'ALLOWED' } },
    });
    const wrapper = render(<VideoLicensingDetails video={video} />);

    expect(await wrapper.findByText('Editing restrictions')).toBeVisible();
    expect(wrapper.getByText(/Follow/)).toBeVisible();
    expect(
      wrapper.getByRole('link', { name: 'standard editing policy' }),
    ).toBeVisible();
  });

  it('displays ALLOWED_WITH_RESTRICTIONS editing restriction', async () => {
    const video = VideoFactory.sample({
      restrictions: { editing: { permission: 'ALLOWED_WITH_RESTRICTIONS' } },
    });
    const wrapper = render(<VideoLicensingDetails video={video} />);

    expect(await wrapper.findByText('Editing restrictions')).toBeVisible();
    expect(
      wrapper.getByText(/Additional restrictions apply as well as/),
    ).toBeVisible();
    expect(
      wrapper.getByRole('link', { name: 'standard editing policy' }),
    ).toBeVisible();
  });

  it('displays NOT_ALLOWED editing restriction', async () => {
    const video = VideoFactory.sample({
      restrictions: { editing: { permission: 'NOT_ALLOWED' } },
    });
    const wrapper = render(<VideoLicensingDetails video={video} />);

    expect(await wrapper.findByText('Editing restrictions')).toBeVisible();
    expect(
      wrapper.getByText('Full Restrictions in place. No editing allowed'),
    ).toBeVisible();
  });

  it('does not display editing restrictions if permission is null', async () => {
    const video = VideoFactory.sample({
      restrictions: { editing: { permission: null } },
    });
    const wrapper = render(<VideoLicensingDetails video={video} />);

    expect(wrapper.queryByText('Editing restrictions')).toBeNull();
  });
});
