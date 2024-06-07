import { render } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { Link } from 'boclips-api-client/dist/types';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { AlignmentVideoCardButtons } from './AlignmentVideoCardButtons';

describe('AlignmentsVideoCardButtons', () => {
  describe('add to cart button', () => {
    it('displays icon only for add to cart button', () => {
      const wrapper = render(
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <QueryClientProvider client={new QueryClient()}>
            <AlignmentVideoCardButtons video={VideoFactory.sample({})} />
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      expect(wrapper.queryByText('Add to cart')).toBeNull();
    });
  });

  describe('download transcript button', () => {
    it('renders download transcript button when user has transcript link', async () => {
      const video = VideoFactory.sample({
        links: {
          self: new Link({ href: '', templated: false }),
          logInteraction: new Link({ href: '', templated: false }),
          transcript: new Link({ href: 'embed', templated: false }),
        },
      });

      const apiClient = new FakeBoclipsClient();
      apiClient.users.insertCurrentUser(
        UserFactory.sample({
          account: {
            ...UserFactory.sample({}).account,
            products: [Product.LIBRARY],
          },
        }),
      );
      const wrapper = render(
        <BoclipsClientProvider client={apiClient}>
          <QueryClientProvider client={new QueryClient()}>
            <AlignmentVideoCardButtons video={video} />
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      expect(
        await wrapper.findByRole('button', { name: 'download-transcript' }),
      ).toBeVisible();
    });
  });
});
