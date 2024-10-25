import React from 'react';
import { render, waitFor } from '@testing-library/react';
import LicensedContentFactory from 'boclips-api-client/dist/test-support/LicensedContentFactory';
import { Link } from 'boclips-api-client/dist/types';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import userEvent from '@testing-library/user-event';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import * as DownloadFileFromUrl from 'src/services/downloadFileFromUrl';
import LicensedContentPrimaryButton from 'src/components/LicensedContentCard/LicensedContentPrimaryButton';
import { lastEvent } from 'src/testSupport/lastEvent';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('LicensedContentCard', () => {
  describe('Embed video button', () => {
    function renderEmbedButton(apiClient: FakeBoclipsClient) {
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

      apiClient.licenses.insertEmbedForVideo('embed-123', 'video-id');

      return render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={apiClient}>
            <QueryClientProvider client={new QueryClient()}>
              <LicensedContentPrimaryButton licensedContent={licensedContent} />
            </QueryClientProvider>
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );
    }

    it('displays embed button when embed link available', async () => {
      const apiClient = new FakeBoclipsClient();
      const wrapper = renderEmbedButton(apiClient);

      expect(wrapper.getByRole('button', { name: 'Embed' })).toBeVisible();
    });

    it('fires platform interacted with event when clicked', async () => {
      Object.assign(navigator, {
        clipboard: {
          writeText: () => Promise.resolve(),
        },
      });
      const apiClient = new FakeBoclipsClient();
      const wrapper = renderEmbedButton(apiClient);
      await userEvent.click(wrapper.getByRole('button', { name: 'Embed' }));

      expect(await wrapper.findByText('Copy embed code')).toBeVisible();

      await userEvent.click(
        await wrapper.findByRole('button', { name: 'Copy embed' }),
      );

      await waitFor(() => {
        expect(lastEvent(apiClient, 'PLATFORM_INTERACTED_WITH')).toEqual({
          type: 'PLATFORM_INTERACTED_WITH',
          subtype: 'MY_CONTENT_EMBED_BUTTON_CLICKED',
          anonymous: false,
        });
      });
    });
  });

  describe('Download video button', () => {
    const renderDownloadButton = (apiClient: FakeBoclipsClient) => {
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

      return render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={apiClient}>
            <QueryClientProvider client={new QueryClient()}>
              <LicensedContentPrimaryButton licensedContent={licensedContent} />
            </QueryClientProvider>
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );
    };

    it('displays download button when download link available and clicking triggers download', async () => {
      const downloadFileSpy = jest.spyOn(
        DownloadFileFromUrl,
        'downloadFileFromUrl',
      );
      const apiClient = new FakeBoclipsClient();
      const wrapper = renderDownloadButton(apiClient);
      const downloadButton = wrapper.getByRole('button', {
        name: 'download-mp4-video',
      });
      expect(downloadButton).toBeVisible();

      await userEvent.click(downloadButton);
      expect(downloadFileSpy).toHaveBeenCalledWith('http://video-id/download');
    });

    it('fires platform interacted with event when clicked', async () => {
      const apiClient = new FakeBoclipsClient();
      const wrapper = renderDownloadButton(apiClient);

      await userEvent.click(
        wrapper.getByRole('button', {
          name: 'download-mp4-video',
        }),
      );
      await waitFor(() => {
        expect(lastEvent(apiClient, 'PLATFORM_INTERACTED_WITH')).toEqual({
          type: 'PLATFORM_INTERACTED_WITH',
          subtype: 'MY_CONTENT_DOWNLOAD_BUTTON_CLICKED',
          anonymous: false,
        });
      });
    });
  });
});
