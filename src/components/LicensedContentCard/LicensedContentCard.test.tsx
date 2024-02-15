import React from 'react';
import { render } from '@testing-library/react';
import LicensedContentCard from 'src/components/LicensedContentCard/LicensedContentCard';
import LicensedContentFactory from 'boclips-api-client/dist/test-support/LicensedContentFactory';
import { Link } from 'boclips-api-client/dist/types';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import userEvent from '@testing-library/user-event';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';

describe('LicensedContentCard', () => {
  it('displays embed button when embed link available', async () => {
    const apiClient = new FakeBoclipsClient();
    const licensesCreateEmbedCodeSpy = jest.spyOn(
      apiClient.licenses,
      'createEmbedCode',
    );

    apiClient.licenses.insertEmbedForVideo('embed', 'video-id');

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
          <LicensedContentCard licensedContent={licensedContent} />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );
    const embedCodeButton = wrapper.getByRole('button', { name: 'Embed Code' });
    expect(embedCodeButton).toBeVisible();

    await userEvent.click(embedCodeButton);
    expect(licensesCreateEmbedCodeSpy).toHaveBeenCalled();
  });
});
