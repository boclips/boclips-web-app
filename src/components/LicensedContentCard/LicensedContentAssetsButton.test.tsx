import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import LicensedContentAssetsButton from 'src/components/LicensedContentCard/LicensedContentAssetsButton';
import LicensedContentFactory from 'boclips-api-client/dist/test-support/LicensedContentFactory';
import { lastEvent } from 'src/testSupport/lastEvent';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Link } from 'boclips-api-client/dist/types';

describe('LicensedContentAssetsButton', () => {
  it('fires an event when video asset button is clicked', async () => {
    const client = new FakeBoclipsClient();
    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={client}>
          <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
            <LicensedContentAssetsButton
              licensedContent={LicensedContentFactory.sample({})}
            />
          </BoclipsSecurityProvider>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    fireEvent.click(wrapper.getByRole('button', { name: 'Video Assets' }));

    await waitFor(() => {
      expect(lastEvent(client, 'PLATFORM_INTERACTED_WITH')).toEqual({
        type: 'PLATFORM_INTERACTED_WITH',
        subtype: 'MY_CONTENT_VIDEO_ASSETS_CLICKED',
        anonymous: false,
      });
    });
  });

  it('fires an event when video metadata button is clicked', async () => {
    const client = new FakeBoclipsClient();
    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={client}>
          <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
            <LicensedContentAssetsButton
              licensedContent={LicensedContentFactory.sample({
                ...LicensedContentFactory.sample({}),
                videoMetadata: {
                  title: 'video-title',
                  channelName: 'channel-name',
                  duration: dayjs.duration('PT112'),
                  links: {
                    self: new Link({ href: 'link', templated: false }),
                    downloadMetadata: new Link({
                      href: '/METADATA',
                      templated: false,
                    }),
                  },
                },
              })}
            />
          </BoclipsSecurityProvider>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    fireEvent.click(wrapper.getByRole('button', { name: 'Video Assets' }));
    await waitFor(() =>
      expect(wrapper.getByRole('button', { name: 'Metadata' })).toBeVisible(),
    );
    fireEvent.click(await wrapper.findByRole('button', { name: 'Metadata' }));

    await waitFor(() => {
      expect(lastEvent(client, 'PLATFORM_INTERACTED_WITH')).toEqual({
        type: 'PLATFORM_INTERACTED_WITH',
        subtype: 'MY_CONTENT_METADATA_DOWNLOADED',
        anonymous: false,
      });
    });
  });
});
