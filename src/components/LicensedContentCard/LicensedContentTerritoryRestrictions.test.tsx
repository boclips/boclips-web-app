import React from 'react';
import { render } from '@testing-library/react';
import LicensedContentFactory from 'boclips-api-client/dist/test-support/LicensedContentFactory';
import { Link } from 'boclips-api-client/dist/types';
import { LicensedContent } from 'boclips-api-client/dist/sub-clients/licenses/model/LicensedContent';
import dayjs from 'dayjs';
import LicensedContentTerritoryRestrictions from '@src/components/LicensedContentCard/LicensedContentTerritoryRestrictions';
import countries from 'iso-3166-1';

describe('Licensed Content Territory restrictions', () => {
  const licensedContent: LicensedContent = LicensedContentFactory.sample({
    videoId: 'video-id',
    license: {
      id: 'license-id',
      orderId: 'order-id',
      startDate: new Date(),
      endDate: new Date(),
      restrictedTerritories: null,
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

  it('should display no restrictions when there are no restricted territories', async () => {
    const content = licensedContentWithRestrictions([]);

    const wrapper = render(
      <LicensedContentTerritoryRestrictions licensedContent={content} />,
    );

    expect(await wrapper.findByText('Restricted in:')).toBeVisible();
    expect(wrapper.getByText('No restrictions')).toBeVisible();
  });

  it('should display no restrictions when restricted territories is null', async () => {
    const content = licensedContentWithRestrictions(null);

    const wrapper = render(
      <LicensedContentTerritoryRestrictions licensedContent={content} />,
    );

    expect(await wrapper.findByText('Restricted in:')).toBeVisible();
    expect(wrapper.getByText('No restrictions')).toBeVisible();
  });

  it('should display no restrictions when restricted territories is undefined', async () => {
    const content = licensedContentWithRestrictions(undefined);

    const wrapper = render(
      <LicensedContentTerritoryRestrictions licensedContent={content} />,
    );

    expect(await wrapper.findByText('Restricted in:')).toBeVisible();
    expect(wrapper.getByText('No restrictions')).toBeVisible();
  });

  it('should display restrictions', async () => {
    const content = licensedContentWithRestrictions(['Australia', 'Italy']);

    const wrapper = render(
      <LicensedContentTerritoryRestrictions licensedContent={content} />,
    );

    expect(await wrapper.findByText('Restricted in:')).toBeVisible();
    expect(wrapper.getByText('Australia, Italy')).toBeVisible();
  });

  it('should display available only countries if there are many restricted ones', async () => {
    const onlyAllowedInPoland = countries
      .all()
      .filter((it) => it.country !== 'Poland')
      .map((it) => it.country);

    const content = licensedContentWithRestrictions(onlyAllowedInPoland);

    const wrapper = render(
      <LicensedContentTerritoryRestrictions licensedContent={content} />,
    );

    expect(await wrapper.findByText('Allowed only in:')).toBeVisible();
    expect(wrapper.getByText('Poland')).toBeVisible();
  });

  function licensedContentWithRestrictions(
    restrictedTerritories?: string[],
  ): LicensedContent {
    return {
      ...licensedContent,
      license: { ...licensedContent.license, restrictedTerritories },
    };
  }
});
