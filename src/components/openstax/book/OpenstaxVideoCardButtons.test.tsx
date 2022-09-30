import { render } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { Link } from 'boclips-api-client/dist/types';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { OpenstaxVideoCardButtons } from './OpenstaxVideoCardButtons';

describe('VideoCardButtons', () => {
  describe('add to cart button', () => {
    it('displays icon only for add to cart button', () => {
      const wrapper = render(
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <QueryClientProvider client={new QueryClient()}>
            <OpenstaxVideoCardButtons video={VideoFactory.sample({})} />
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      expect(wrapper.queryByText('Add to cart')).toBeNull();
    });
  });
  describe('download transcript button', () => {
    it('renders download transcript button when user has transcript link', () => {
      const video = VideoFactory.sample({
        links: {
          self: new Link({ href: '', templated: false }),
          logInteraction: new Link({ href: '', templated: false }),
          transcript: new Link({ href: 'embed', templated: false }),
        },
      });

      const wrapper = render(
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <QueryClientProvider client={new QueryClient()}>
            <OpenstaxVideoCardButtons video={video} />
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      expect(
        wrapper.getByRole('button', { name: 'download-transcript' }),
      ).toBeVisible();
    });
  });

  describe(`create embed code button`, () => {
    it(`renders embed code button when user has link and is on openstax page`, () => {
      const video = VideoFactory.sample({
        links: {
          self: new Link({ href: '', templated: false }),
          logInteraction: new Link({ href: '', templated: false }),
          createEmbedCode: new Link({ href: 'embed', templated: false }),
        },
      });

      const wrapper = render(
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <QueryClientProvider client={new QueryClient()}>
            <OpenstaxVideoCardButtons video={video} />
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      expect(wrapper.getByRole('button', { name: 'embed' })).toBeVisible();
    });

    it(`does not render embed code button when user doesn't have link`, () => {
      const video = VideoFactory.sample({
        links: {
          self: new Link({ href: '', templated: false }),
          logInteraction: new Link({ href: '', templated: false }),
        },
      });
      const wrapper = render(
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <QueryClientProvider client={new QueryClient()}>
            <OpenstaxVideoCardButtons video={video} />
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      expect(wrapper.queryByRole('button', { name: 'embed' })).toBeNull();
    });
  });
});
