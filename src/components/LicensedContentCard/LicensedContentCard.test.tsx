import LicensedContentCard from 'src/components/LicensedContentCard/LicensedContentCard';
import React from 'react';

import { Link } from 'boclips-api-client/dist/types';
import dayjs from 'dayjs';
import { LicensedContent } from 'boclips-api-client/dist/sub-clients/licenses/model/LicensedContent';
import LicensedContentFactory from 'boclips-api-client/dist/test-support/LicensedContentFactory';
import { renderWithClients } from 'src/testSupport/render';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';

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

  it('make order a clickable link to order details page', () => {
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
});
