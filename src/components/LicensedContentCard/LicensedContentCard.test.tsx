import LicensedContentCard from 'src/components/LicensedContentCard/LicensedContentCard';
import React from 'react';
import { Link } from 'boclips-api-client/dist/types';
import dayjs from 'dayjs';
import { LicensedContent } from 'boclips-api-client/dist/sub-clients/licenses/model/LicensedContent';
import LicensedContentFactory from 'boclips-api-client/dist/test-support/LicensedContentFactory';
import { render, renderWithClients } from 'src/testSupport/render';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { RenderResult, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';

describe('Licensed Content Card', () => {
  it('make title a clickable link to video page', () => {
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
        <LicensedContentCard licensedContent={licensedContent} />,
      </BoclipsSecurityProvider>,
    );
    expect(wrapper.getByText('video-title')).toBeVisible();
    expect(wrapper.getByText('video-title').closest('a')).toHaveAttribute(
      'href',
      '/videos/video-id',
    );
  });

  it('make order id a clickable link to order details page', () => {
    const licensedContent: LicensedContent = LicensedContentFactory.sample({
      videoId: 'video-id',
      license: {
        id: 'video-id',
        orderId: 'order-1',
        startDate: new Date('2022-01-11'),
        endDate: new Date('2023-02-11'),
      },
    });

    const wrapper = renderWithClients(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <LicensedContentCard licensedContent={licensedContent} />,
      </BoclipsSecurityProvider>,
    );
    expect(wrapper.getByText('order-1')).toBeVisible();
    expect(wrapper.getByText('order-1').closest('a')).toHaveAttribute(
      'href',
      '/orders/order-1',
    );
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

      const wrapper = renderWithClients(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <LicensedContentCard licensedContent={licensedContent} />
        </BoclipsSecurityProvider>,
      );

      expect(await getAssetOption(wrapper, 'Metadata')).toBeVisible();
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

    const wrapper = renderWithClients(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <LicensedContentCard licensedContent={licensedContent} />
      </BoclipsSecurityProvider>,
    );

    expect(await getAssetOption(wrapper, 'Transcript')).toBeVisible();
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

  it('should have Captions option when clicked Video Assets button', async () => {
    const licensedContent: LicensedContent = LicensedContentFactory.sample({
      videoId: 'video-id',
      videoMetadata: {
        title: 'video-title',
        channelName: 'channel-name',
        duration: dayjs.duration('PT112'),
        links: {
          self: new Link({ href: 'link', templated: false }),
          download: new Link({ href: 'download', templated: false }),
        },
      },
    });

    const wrapper = renderWithClients(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <LicensedContentCard licensedContent={licensedContent} />
      </BoclipsSecurityProvider>,
    );

    expect(await getAssetOption(wrapper, 'Captions')).toBeVisible();
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
          download: new Link({ href: 'download', templated: false }),
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

  it('should not have Captions option when deliveryMethod is EMBED', async () => {
    const licensedContent: LicensedContent = LicensedContentFactory.sample({
      videoId: 'video-id',
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
    const getTranscriptSpy = jest
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
