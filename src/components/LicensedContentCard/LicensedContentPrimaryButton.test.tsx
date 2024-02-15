import React from 'react';
import { render } from '@testing-library/react';
import LicensedContentFactory from 'boclips-api-client/dist/test-support/LicensedContentFactory';
import { Link } from 'boclips-api-client/dist/types';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import userEvent from '@testing-library/user-event';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import * as DownloadFileFromUrl from 'src/services/downloadFileFromUrl';
import LicensedContentPrimaryButton from 'src/components/LicensedContentCard/LicensedContentPrimaryButton';

describe('LicensedContentCard', () => {
  describe('Embed code button', () => {
    it('displays embed button when embed link available', async () => {
      const apiClient = new FakeBoclipsClient();

      const licensedContent = LicensedContentFactory.sample({
        videoId: 'video-id',
        videoMetadata: {
          ...LicensedContentFactory.sample({}).videoMetadata,
          links: {
            self: new Link({ href: 'link', templated: false }),
            createEmbedCode: new Link({
              href: 'createEmbed',
              templated: false,
            }),
          },
        },
      });
      const wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={apiClient}>
            <LicensedContentPrimaryButton licensedContent={licensedContent} />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );

      expect(wrapper.getByRole('button', { name: 'embed' })).toBeVisible();
    });
  });

  describe('Download video button', () => {
    it('displays download button when download link available and clicking triggers download', async () => {
      const apiClient = new FakeBoclipsClient();
      const downloadFileSpy = jest.spyOn(
        DownloadFileFromUrl,
        'downloadFileFromUrl',
      );

      apiClient.licenses.insertDownloadUrl(
        'http://video-id/download',
        'video-id',
      );

      const licensedContent = LicensedContentFactory.sample({
        videoId: 'video-id',
        videoMetadata: {
          ...LicensedContentFactory.sample({}).videoMetadata,
          links: {
            self: new Link({ href: 'link', templated: false }),
            download: new Link({
              href: 'download',
              templated: false,
            }),
          },
        },
      });
      const wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={apiClient}>
            <LicensedContentPrimaryButton licensedContent={licensedContent} />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );
      const downloadButton = wrapper.getByRole('button', {
        name: 'download-mp4-video',
      });
      expect(downloadButton).toBeVisible();

      await userEvent.click(downloadButton);
      expect(downloadFileSpy).toHaveBeenCalledWith('http://video-id/download');
    });
  });
});
