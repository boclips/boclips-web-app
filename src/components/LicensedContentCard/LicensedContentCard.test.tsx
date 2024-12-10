import LicensedContentCard from '@components/LicensedContentCard/LicensedContentCard';
import React from 'react';
import { Link } from 'boclips-api-client/dist/types';
import dayjs from 'dayjs';
import { LicensedContent } from 'boclips-api-client/dist/sub-clients/licenses/model/LicensedContent';
import LicensedContentFactory from 'boclips-api-client/dist/test-support/LicensedContentFactory';
import { render, renderWithClients } from '@src/testSupport/render';
import { stubBoclipsSecurity } from '@src/testSupport/StubBoclipsSecurity';
import { BoclipsSecurityProvider } from '@components/common/providers/BoclipsSecurityProvider';
import {
  fireEvent,
  RenderResult,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import { lastEvent } from '@src/testSupport/lastEvent';

describe('Licensed Content Card', () => {
  it('make title a clickable link to video page', async () => {
    const licensedContent: LicensedContent = LicensedContentFactory.sample({
      videoId: 'video-id',
      videoMetadata: {
        title: 'video-title',
        channelName: 'channel-name',
        duration: dayjs.duration('PT112'),
        links: {
          self: new Link({ href: 'link', templated: false }),
        },
      },
    });
    const client = new FakeBoclipsClient();
    const wrapper = renderWithClients(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <LicensedContentCard licensedContent={licensedContent} />,
      </BoclipsSecurityProvider>,
      client,
    );
    const title = wrapper.getByText('video-title');
    expect(title).toBeVisible();
    expect(title.closest('a')).toHaveAttribute('href', '/videos/video-id');

    fireEvent.click(title);
    await waitFor(() => {
      expect(lastEvent(client, 'PLATFORM_INTERACTED_WITH')).toEqual({
        type: 'PLATFORM_INTERACTED_WITH',
        subtype: 'MY_CONTENT_VIDEO_TITLE_CLICKED',
        anonymous: false,
      });
    });
  });

  it('make order id a clickable link to order details page', async () => {
    const licensedContent: LicensedContent = LicensedContentFactory.sample({
      videoId: 'video-id',
      license: {
        id: 'video-id',
        orderId: 'order-1',
        startDate: new Date('2022-01-11'),
        endDate: new Date('2023-02-11'),
      },
    });
    const fakeClient = new FakeBoclipsClient();

    const wrapper = renderWithClients(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <LicensedContentCard licensedContent={licensedContent} />,
      </BoclipsSecurityProvider>,
      fakeClient,
    );
    expect(wrapper.getByText('order-1')).toBeVisible();
    expect(wrapper.getByText('order-1').closest('a')).toHaveAttribute(
      'href',
      '/orders/order-1',
    );

    fireEvent.click(wrapper.getByText('order-1'));
    await waitFor(() => {
      expect(lastEvent(fakeClient, 'PLATFORM_INTERACTED_WITH')).toEqual({
        type: 'PLATFORM_INTERACTED_WITH',
        subtype: 'MY_CONTENT_AREA_ORDER_ID_CLICKED',
        anonymous: false,
      });
    });
  });

  it('should have Video Assets button visible', async () => {
    const licensedContent: LicensedContent = LicensedContentFactory.sample({
      videoId: 'video-id',
      videoMetadata: {
        title: 'video-title',
        channelName: 'channel-name',
        duration: dayjs.duration('PT112'),
        links: {
          self: new Link({ href: 'link', templated: false }),
        },
      },
    });

    const wrapper = renderWithClients(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <LicensedContentCard licensedContent={licensedContent} />
      </BoclipsSecurityProvider>,
    );

    expect(wrapper.getByRole('button', { name: 'Video Assets' })).toBeVisible();
  });

  describe('Metadata', () => {
    it('should have Metadata option when clicked Video Assets button', async () => {
      const licensedContent: LicensedContent = LicensedContentFactory.sample({
        videoId: 'video-id',
        videoMetadata: {
          title: 'video-title',
          channelName: 'channel-name',
          duration: dayjs.duration('PT112'),
          links: {
            self: new Link({ href: 'link', templated: false }),
            downloadMetadata: new Link({ href: '/METADATA', templated: false }),
          },
        },
      });
      const fakeClient = new FakeBoclipsClient();

      const wrapper = renderWithClients(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <LicensedContentCard licensedContent={licensedContent} />
        </BoclipsSecurityProvider>,
        fakeClient,
      );

      expect(await getAssetOption(wrapper, 'Metadata')).toBeVisible();
      fireEvent.click(
        await wrapper.findByRole('menuitem', { name: 'Metadata' }),
      );

      await waitFor(() => {
        expect(lastEvent(fakeClient, 'PLATFORM_INTERACTED_WITH')).toEqual({
          type: 'PLATFORM_INTERACTED_WITH',
          subtype: 'MY_CONTENT_METADATA_BUTTON_CLICKED',
          anonymous: false,
        });
      });
    });

    it('should not have Metadata option when metadata link is missing', async () => {
      const licensedContent: LicensedContent = LicensedContentFactory.sample({
        videoId: 'video-id',
        videoMetadata: {
          title: 'video-title',
          channelName: 'channel-name',
          duration: dayjs.duration('PT112'),
          links: {
            self: new Link({ href: 'link', templated: false }),
          },
        },
      });

      const wrapper = renderWithClients(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <LicensedContentCard licensedContent={licensedContent} />
        </BoclipsSecurityProvider>,
      );

      expect(await getAssetOption(wrapper, 'Metadata')).toBeUndefined();
    });
  });

  it('should have Transcript option when clicked Video Assets button', async () => {
    const licensedContent: LicensedContent = LicensedContentFactory.sample({
      videoId: 'video-id',
      videoMetadata: {
        title: 'video-title',
        channelName: 'channel-name',
        duration: dayjs.duration('PT112'),
        links: {
          self: new Link({ href: 'link', templated: false }),
          transcript: new Link({ href: 'transcript', templated: false }),
        },
      },
    });
    const fakeClient = new FakeBoclipsClient();

    const wrapper = renderWithClients(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <LicensedContentCard licensedContent={licensedContent} />
      </BoclipsSecurityProvider>,
      fakeClient,
    );

    expect(await getAssetOption(wrapper, 'Transcript')).toBeVisible();
    fireEvent.click(
      await wrapper.findByRole('menuitem', { name: 'Transcript' }),
    );

    await waitFor(() => {
      expect(lastEvent(fakeClient, 'PLATFORM_INTERACTED_WITH')).toEqual({
        type: 'PLATFORM_INTERACTED_WITH',
        subtype: 'MY_CONTENT_TRANSCRIPT_BUTTON_CLICKED',
        anonymous: false,
      });
    });
  });

  it('should not have Transcript option when video has no transcript', async () => {
    const licensedContent: LicensedContent = LicensedContentFactory.sample({
      videoId: 'video-id',
      videoMetadata: {
        title: 'video-title',
        channelName: 'channel-name',
        duration: dayjs.duration('PT112'),
        links: {
          self: new Link({ href: 'link', templated: false }),
        },
      },
    });

    const wrapper = renderWithClients(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <LicensedContentCard licensedContent={licensedContent} />
      </BoclipsSecurityProvider>,
    );

    expect(await getAssetOption(wrapper, 'Transcript')).toBeUndefined();
  });

  it('should have Captions option when Video Assets button clicked and captions link present', async () => {
    const licensedContent: LicensedContent = LicensedContentFactory.sample({
      videoId: 'video-id',
      videoMetadata: {
        title: 'video-title',
        channelName: 'channel-name',
        duration: dayjs.duration('PT112'),
        links: {
          self: new Link({ href: 'link', templated: false }),
          downloadCaptions: new Link({
            href: 'downloadCaptions',
            templated: false,
          }),
        },
      },
    });
    const fakeClient = new FakeBoclipsClient();

    const wrapper = renderWithClients(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <LicensedContentCard licensedContent={licensedContent} />
      </BoclipsSecurityProvider>,
      fakeClient,
    );

    expect(await getAssetOption(wrapper, 'Captions')).toBeVisible();
    fireEvent.click(await wrapper.findByRole('menuitem', { name: 'Captions' }));

    await waitFor(() => {
      expect(lastEvent(fakeClient, 'PLATFORM_INTERACTED_WITH')).toEqual({
        type: 'PLATFORM_INTERACTED_WITH',
        subtype: 'MY_CONTENT_CAPTIONS_BUTTON_CLICKED',
        anonymous: false,
      });
    });
  });

  it('should open Captions modal when Captions button clicked', async () => {
    const licensedContent: LicensedContent = LicensedContentFactory.sample({
      videoId: 'video-id',
      videoMetadata: {
        title: 'video-title',
        channelName: 'channel-name',
        duration: dayjs.duration('PT112'),
        links: {
          self: new Link({ href: 'link', templated: false }),
          downloadCaptions: new Link({
            href: 'downloadCaptions',
            templated: false,
          }),
        },
      },
    });

    const wrapper = renderWithClients(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <LicensedContentCard licensedContent={licensedContent} />
      </BoclipsSecurityProvider>,
    );

    const captionsButton = await getAssetOption(wrapper, 'Captions');
    expect(captionsButton).toBeVisible();

    await userEvent.click(captionsButton);
    await waitFor(async () =>
      expect(wrapper.getByText('Download Captions')).toBeVisible(),
    );
  });

  it('should not have Captions option when downloadCaptions link is null', async () => {
    const licensedContent: LicensedContent = LicensedContentFactory.sample({
      videoId: 'video-id',
      videoMetadata: {
        title: 'video-title',
        channelName: 'channel-name',
        duration: dayjs.duration('PT112'),
        links: {
          self: new Link({ href: 'link', templated: false }),
          downloadCaptions: null,
        },
      },
    });

    const wrapper = renderWithClients(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <LicensedContentCard licensedContent={licensedContent} />
      </BoclipsSecurityProvider>,
    );

    expect(await getAssetOption(wrapper, 'Captions')).toBeUndefined();
  });

  it('clicking the Transcript option should result in a call to download transcript', async () => {
    const licensedContent: LicensedContent = LicensedContentFactory.sample({
      videoId: 'video-id',
      videoMetadata: {
        title: 'video-title',
        channelName: 'channel-name',
        duration: dayjs.duration('PT112'),
        links: {
          self: new Link({ href: 'link', templated: false }),
          transcript: new Link({ href: 'transcript', templated: false }),
        },
      },
    });

    const fakeClient = new FakeBoclipsClient();
    const getTranscriptSpy = vi
      .spyOn(fakeClient.licenses, 'getTranscript')
      .mockImplementation(() =>
        Promise.resolve({ content: 'blah', filename: 'blah.txt' }),
      );

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <LicensedContentCard licensedContent={licensedContent} />
        </BoclipsSecurityProvider>
      </BoclipsClientProvider>,
    );

    const transcriptOption = await getAssetOption(wrapper, 'Transcript');
    await userEvent.click(transcriptOption);

    expect(getTranscriptSpy).toHaveBeenCalledWith(licensedContent);
  });

  const getAssetOption = async (wrapper: RenderResult, name: string) => {
    await userEvent.click(
      wrapper.getByRole('button', { name: 'Video Assets' }),
    );
    const options = wrapper.queryAllByRole('menuitem');
    return options?.find((element) => within(element).queryByText(name));
  };

  it('should display territory restrictions', async () => {
    const licensedContent: LicensedContent = LicensedContentFactory.sample({
      videoId: 'video-id',
      license: {
        id: 'license-id',
        orderId: 'order-id',
        startDate: new Date(),
        endDate: new Date(),
        restrictedTerritories: ['Australia'],
      },
      videoMetadata: {
        title: 'video-title',
        channelName: 'channel-name',
        duration: dayjs.duration('PT112'),
        links: {
          self: new Link({ href: 'link', templated: false }),
          createEmbedCode: new Link({ href: 'embed', templated: false }),
        },
      },
    });

    const wrapper = renderWithClients(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <LicensedContentCard licensedContent={licensedContent} />
      </BoclipsSecurityProvider>,
    );

    expect(await wrapper.findByText('Restricted in:')).toBeVisible();
    expect(wrapper.getByText('Australia')).toBeVisible();
  });
});
