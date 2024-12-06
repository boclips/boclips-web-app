import { fireEvent, render } from '@testing-library/react';
import { CaptionsModal } from '@components/LicensedContentCard/CaptionsModal';
import React from 'react';
import { Link } from 'boclips-api-client/dist/sub-clients/common/model/LinkEntity';
import * as DownloadFileFromUrl from '@src/services/downloadFileFromUrl';

describe(`captions modal`, () => {
  it(`displays info about captions processing when no link provided`, () => {
    const wrapper = render(
      <CaptionsModal setOpen={jest.fn} downloadLink={null} />,
    );

    expect(
      wrapper.getByText(
        'Human-generated captions are being processed. It will take up to 72 hours once order has been placed.',
      ),
    ).toBeVisible();
  });

  it(`can download multiple formats`, () => {
    const downloadFileSpy = jest
      .spyOn(DownloadFileFromUrl, 'fetchFile')
      .mockImplementation(() => {});
    const link = new Link({ href: '/captions', templated: false });
    const wrapper = render(
      <CaptionsModal setOpen={jest.fn} downloadLink={link} />,
    );

    expect(
      wrapper.queryByText(
        'Human-generated captions are being processed. It will take up to 72 hours once order has been placed.',
      ),
    ).toBeNull();

    const webvttCheckbox = wrapper.getByLabelText('English WEBVTT');
    const srtCheckbox = wrapper.getByLabelText('English SRT');
    expect(webvttCheckbox).toBeVisible();
    expect(srtCheckbox).toBeVisible();
    expect(wrapper.getByRole('button', { name: 'Download' })).toBeVisible();

    fireEvent.click(webvttCheckbox);
    fireEvent.click(srtCheckbox);

    fireEvent.click(wrapper.getByRole('button', { name: 'Download' }));

    expect(downloadFileSpy).toHaveBeenCalledTimes(2);
  });

  it(`if no captions selected download button is disabled`, () => {
    const downloadFileSpy = jest
      .spyOn(DownloadFileFromUrl, 'fetchFile')
      .mockImplementation(() => {});
    const link = new Link({ href: '/captions', templated: false });
    const wrapper = render(
      <CaptionsModal setOpen={jest.fn} downloadLink={link} />,
    );

    expect(wrapper.getByRole('button', { name: 'Download' })).toBeVisible();
    expect(wrapper.getByRole('button', { name: 'Download' })).toBeDisabled();
    fireEvent.click(wrapper.getByRole('button', { name: 'Download' }));

    expect(downloadFileSpy).toHaveBeenCalledTimes(0);
  });

  it(`can download webvtt captions`, () => {
    const downloadFileSpy = jest
      .spyOn(DownloadFileFromUrl, 'fetchFile')
      .mockImplementation(() => {});
    const link = new Link({ href: '/captions{?format}', templated: true });
    const wrapper = render(
      <CaptionsModal setOpen={jest.fn} downloadLink={link} />,
    );

    expect(
      wrapper.queryByText(
        'Human-generated captions are being processed. It will take up to 72 hours once order has been placed.',
      ),
    ).toBeNull();

    fireEvent.click(wrapper.getByLabelText('English WEBVTT'));
    fireEvent.click(wrapper.getByRole('button', { name: 'Download' }));

    expect(downloadFileSpy).toHaveBeenCalledTimes(1);
    expect(downloadFileSpy).toHaveBeenCalledWith('/captions?format=VTT');
  });

  it(`can download srt captions`, () => {
    const downloadFileSpy = jest
      .spyOn(DownloadFileFromUrl, 'fetchFile')
      .mockImplementation(() => {});
    const link = new Link({ href: '/captions{?format}', templated: true });
    const wrapper = render(
      <CaptionsModal setOpen={jest.fn} downloadLink={link} />,
    );

    expect(
      wrapper.queryByText(
        'Human-generated captions are being processed. It will take up to 72 hours once order has been placed.',
      ),
    ).toBeNull();

    fireEvent.click(wrapper.getByLabelText('English SRT'));
    fireEvent.click(wrapper.getByRole('button', { name: 'Download' }));

    expect(downloadFileSpy).toHaveBeenCalledTimes(1);
    expect(downloadFileSpy).toHaveBeenCalledWith('/captions?format=SRT');
  });
});
