import { render, waitFor, within } from '@testing-library/react';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import React from 'react';
import { VideoLicensingDetails } from 'src/components/videoPage/videoLicensingDetails/VideoLicensingDetails';
import userEvent from '@testing-library/user-event';

describe('Video licensing details in video page', () => {
  it('displays Licensing Details title', () => {
    const video = VideoFactory.sample({});
    const wrapper = render(<VideoLicensingDetails video={video} />);

    expect(wrapper.getByText('Licensing Details')).toBeVisible();
  });

  describe('max license duration', () => {
    it('displays max license duration', () => {
      const video = VideoFactory.sample({ maxLicenseDurationYears: 3 });
      const wrapper = render(<VideoLicensingDetails video={video} />);

      expect(wrapper.getByText('Maximum Licensing Term')).toBeVisible();
      expect(wrapper.getByText('3 years')).toBeVisible();
    });
  });

  describe('editing restrictions', () => {
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

  describe('territory restrictions', () => {
    it('does not display territory restrictions row if there is no restriction', () => {
      const video = VideoFactory.sample({
        restrictions: { territory: { type: 'NO_RESTRICTIONS' } },
      });
      const wrapper = render(<VideoLicensingDetails video={video} />);

      expect(wrapper.queryByText('Territory restrictions')).toBeNull();
    });

    it('does not display territory restrictions row if the restriction type is null', () => {
      const video = VideoFactory.sample({
        restrictions: { territory: { type: null } },
      });
      const wrapper = render(<VideoLicensingDetails video={video} />);

      expect(wrapper.queryByText('Territory restrictions')).toBeNull();
    });

    it('does not display territory restrictions row if the restriction type is undefined', () => {
      const video = VideoFactory.sample({
        restrictions: { territory: { type: undefined } },
      });
      const wrapper = render(<VideoLicensingDetails video={video} />);

      expect(wrapper.queryByText('Territory restrictions')).toBeNull();
    });

    it('displays 1 country restricted with tooltip containing the country name', async () => {
      const video = VideoFactory.sample({
        restrictions: {
          territory: { type: 'RESTRICTED', territories: ['FRANCE'] },
        },
      });
      const wrapper = render(<VideoLicensingDetails video={video} />);

      expect(await wrapper.findByText('Territory restrictions')).toBeVisible();

      await userEvent.hover(wrapper.getByTestId('territories-details'));

      expect(wrapper.getByText('1 country')).toBeVisible();

      await waitFor(() => {
        expect(wrapper.getByRole('tooltip')).toBeInTheDocument();
        expect(wrapper.getAllByText('FRANCE')).toHaveLength(2);
      });
    });

    it('displays 3 countries restricted with tooltip containing the countries name', async () => {
      const video = VideoFactory.sample({
        restrictions: {
          territory: {
            type: 'RESTRICTED',
            territories: ['FRANCE', 'SPAIN', 'ITALY'],
          },
        },
      });
      const wrapper = render(<VideoLicensingDetails video={video} />);

      await userEvent.hover(wrapper.getByTestId('territories-details'));

      expect(wrapper.getByText('3 countries')).toBeVisible();

      await waitFor(() => {
        expect(wrapper.getByRole('tooltip')).toBeInTheDocument();
        expect(wrapper.getAllByText('FRANCE, SPAIN, ITALY')).toHaveLength(2);
      });
    });
  });
  describe('video restrictions', () => {
    it('does not display video restrictions row if there are none', () => {
      const video = VideoFactory.sample({
        restrictions: { video: undefined },
      });
      const wrapper = render(<VideoLicensingDetails video={video} />);

      expect(wrapper.queryByText('Video restrictions')).toBeNull();
    });

    it('displays long video restrictions with ellipsis and tooltip containing full restriction', async () => {
      const video = VideoFactory.sample({
        restrictions: {
          video: 'A really really really stupid long restriction',
        },
      });
      const wrapper = render(<VideoLicensingDetails video={video} />);

      expect(await wrapper.findByText('Video restrictions')).toBeVisible();
      expect(wrapper.getByTestId('video-restriction-details')).toHaveClass(
        'truncate',
      );

      await userEvent.hover(wrapper.getByTestId('video-restriction-tooltip'));

      expect(
        wrapper.getByText('A really really really stupid long restriction'),
      ).toBeVisible();

      await waitFor(() => {
        expect(wrapper.getByRole('tooltip')).toBeInTheDocument();
        expect(
          within(wrapper.getByRole('tooltip')).getByText(
            'A really really really stupid long restriction',
          ),
        ).toBeVisible();
      });
    });
  });
});
