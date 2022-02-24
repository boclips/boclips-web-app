import { render } from '@testing-library/react';
import React from 'react';
import { VideoAdditionalServices } from 'src/components/videoPage/VideoAdditionalServices';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BoclipsClientProvider } from '../common/providers/BoclipsClientProvider';

describe('Video Additional Services', () => {
  it('shows correct message for Pearson organisation', async () => {
    window.Environment = {
      PEARSON_ORGANISATION_ID: '123',
    };

    const pearsonUser = UserFactory.sample({
      organisation: {
        id: '123',
        name: 'Specified org',
      },
    });

    const apiClient = new FakeBoclipsClient();

    apiClient.users.insertCurrentUser(pearsonUser);

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <VideoAdditionalServices />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(
      await wrapper.findByText(
        'Captions, transcripts, video trimming, and other editing requests are ' +
          'available upon request from your shopping cart. All additional services ' +
          'are available free of charge.',
      ),
    ).toBeVisible();
  });

  it('shows correct message for non-Pearson organisation', async () => {
    window.Environment = {
      PEARSON_ORGANISATION_ID: '123',
    };

    const user = UserFactory.sample({
      organisation: {
        id: '456',
        name: 'Specified org',
      },
    });

    const apiClient = new FakeBoclipsClient();

    apiClient.users.insertCurrentUser(user);

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <VideoAdditionalServices />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(
      await wrapper.findByText(
        'Captions, transcripts, video trimming, and other editing requests are ' +
          'available upon request from your shopping cart.',
      ),
    ).toBeVisible();
  });
});
