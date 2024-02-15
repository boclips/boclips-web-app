import { render, RenderResult, within } from '@testing-library/react';
import React from 'react';
import { Link } from 'boclips-api-client/dist/types';
import { LicensedContent } from 'boclips-api-client/dist/sub-clients/licenses/model/LicensedContent';
import LicensedContentCard from 'src/components/LicensedContentCard/LicensedContentCard';
import dayjs from 'dayjs';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import userEvent from '@testing-library/user-event';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';

const duration = require('dayjs/plugin/duration');

dayjs.extend(duration);

describe('Licensed Content Card', () => {
  const licensedContent: LicensedContent = {
    videoId: 'id',
    license: {
      id: 'video-id',
      orderId: 'order-id',
      startDate: new Date('2022-01-11'),
      endDate: new Date('2023-02-11'),
    },
    videoMetadata: {
      title: 'video-title',
      channelName: 'channel-name',
      duration: dayjs.duration('PT112'),
      links: {
        self: new Link({ href: 'link', templated: false }),
      },
    },
  };

  it('should have Video Assets button visible', async () => {
    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <LicensedContentCard licensedContent={licensedContent} />
      </BoclipsSecurityProvider>,
    );

    expect(wrapper.getByRole('button', { name: 'Video Assets' })).toBeVisible();
  });

  it('should have Transcript option when clicked Video Assets button', async () => {
    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <LicensedContentCard licensedContent={licensedContent} />
      </BoclipsSecurityProvider>,
    );

    expect(await getAssetOption(wrapper, 'Transcript')).toBeVisible();
  });

  it('clicking the Transcript option should result in a call to download transcript', async () => {
    const fakeClient = new FakeBoclipsClient();
    const getTranscriptSpy = jest
      .spyOn(fakeClient.videos, 'getTranscript')
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

    expect(getTranscriptSpy).toHaveBeenCalledWith({ title: 'video-title' });
  });

  const getAssetOption = async (wrapper: RenderResult, name: string) => {
    await userEvent.click(
      wrapper.getByRole('button', { name: 'Video Assets' }),
    );
    const options = wrapper.queryAllByRole('menuitem');
    return options?.find((element) => within(element).queryByText(name));
  };
});
