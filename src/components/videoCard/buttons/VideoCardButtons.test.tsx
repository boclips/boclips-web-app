import { VideoCardButtons } from 'src/components/videoCard/buttons/VideoCardButtons';
import React from 'react';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { Link } from 'boclips-api-client/dist/types';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import {
  AccountType,
  Product,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

describe('VideoCardButtons', () => {
  describe(`create embed code button`, () => {
    it(`renders embed code button when user has video embed link and LIBRARY product`, async () => {
      const video = VideoFactory.sample({
        links: {
          self: new Link({ href: '', templated: false }),
          logInteraction: new Link({ href: '', templated: false }),
          createEmbedCode: new Link({ href: 'embed', templated: false }),
        },
      });

      const apiClient = new FakeBoclipsClient();

      apiClient.users.insertCurrentUser(
        UserFactory.sample({
          account: {
            ...UserFactory.sample().account,
            products: [Product.LIBRARY],
          },
        }),
      );

      const wrapper = render(
        <BoclipsClientProvider client={apiClient}>
          <QueryClientProvider client={new QueryClient()}>
            <VideoCardButtons video={video} />
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      expect(
        await wrapper.findByRole('button', { name: 'embed' }),
      ).toBeVisible();
    });

    it(`does not render embed code button when user doesn't have video embed link`, () => {
      const video = VideoFactory.sample({
        links: {
          self: new Link({ href: '', templated: false }),
          logInteraction: new Link({ href: '', templated: false }),
        },
      });
      const wrapper = render(
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <QueryClientProvider client={new QueryClient()}>
            <VideoCardButtons video={video} />
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      expect(wrapper.queryByRole('button', { name: 'embed' })).toBeNull();
    });
  });

  describe(`copy video link button`, () => {
    it(`renders copy video link button when LIBRARY user`, async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.users.insertCurrentUser(
        UserFactory.sample({
          account: {
            ...UserFactory.sample().account,
            id: 'acc-1',
            name: 'Ren',
            products: [Product.LIBRARY],
            type: AccountType.STANDARD,
          },
        }),
      );

      const video = VideoFactory.sample({ id: '1', title: '1' });

      const wrapper = render(
        <BoclipsClientProvider client={fakeClient}>
          <QueryClientProvider client={new QueryClient()}>
            <VideoCardButtons video={video} />
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      expect(
        await wrapper.findByRole('button', { name: 'Copy video link' }),
      ).toBeVisible();
    });

    it(`does not render copy video link button when Classroom user`, () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.users.insertCurrentUser(
        UserFactory.sample({
          account: {
            ...UserFactory.sample().account,
            id: 'acc-1',
            name: 'Ren',
            products: [Product.CLASSROOM],
            type: AccountType.STANDARD,
          },
        }),
      );

      const video = VideoFactory.sample({ id: '1', title: '1' });

      const wrapper = render(
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <QueryClientProvider client={new QueryClient()}>
            <VideoCardButtons video={video} />
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      expect(
        wrapper.queryByRole('button', { name: 'Copy video link' }),
      ).toBeNull();
    });
  });

  describe(`share video button`, () => {
    it('should render share video button if product is CLASSROOM', async () => {
      const client = new FakeBoclipsClient();
      client.users.insertCurrentUser(
        UserFactory.sample({
          account: {
            ...UserFactory.sample().account,
            id: 'acc-1',
            name: 'Ren',
            products: [Product.CLASSROOM],
            type: AccountType.STANDARD,
          },
        }),
      );

      const wrapper = render(
        <BoclipsClientProvider client={client}>
          <QueryClientProvider client={new QueryClient()}>
            <VideoCardButtons video={VideoFactory.sample({})} />
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      expect(
        await wrapper.findByRole('button', { name: 'Share' }),
      ).toBeVisible();
    });
  });
});
