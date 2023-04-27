import { VideoCardButtons } from 'src/components/videoCard/buttons/VideoCardButtons';
import React from 'react';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { Link } from 'boclips-api-client/dist/types';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('VideoCardButtons', () => {
  describe(`create embed code button`, () => {
    it(`renders embed code button when user has video embed link`, () => {
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
            <VideoCardButtons video={video} />
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      expect(wrapper.getByRole('button', { name: 'embed' })).toBeVisible();
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
});
