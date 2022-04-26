import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render } from 'src/testSupport/render';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import AddToCartButton from 'src/components/addToCartButton/AddToCartButton';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import HotjarFactory from 'src/services/hotjar/HotjarFactory';

describe('Add to cart button', () => {
  const video = VideoFactory.sample({
    title: 'video killed the radio star',
  });

  it('Remove label after video added to cart', async () => {
    const apiClient = new FakeBoclipsClient();

    const wrapper = render(
      <BoclipsClientProvider client={apiClient}>
        <AddToCartButton video={video} />
      </BoclipsClientProvider>,
    );

    const addToCartButton = await wrapper.findByText('Add to cart');

    fireEvent.click(addToCartButton);

    expect(await wrapper.findByText('Remove')).toBeInTheDocument();
  });

  it('sends video added to cart Hotjar user attributes', async () => {
    const apiClient = new FakeBoclipsClient();
    const hotjarVideoAddedToCart = jest.spyOn(
      HotjarFactory.hotjar(),
      'videoAddedToCart',
    );
    const user = UserFactory.sample({
      id: 'user-100',
      organisation: {
        id: 'org-1',
        name: 'Org 1',
      },
    });
    apiClient.users.insertCurrentUser(user);

    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={apiClient}>
          <AddToCartButton video={video} />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    const addToCartButton = await wrapper.findByText('Add to cart');

    fireEvent.click(addToCartButton);

    await waitFor(() =>
      expect(hotjarVideoAddedToCart).toHaveBeenCalledWith({
        userId: user.id,
        organisationId: user.organisation.id,
        organisationName: user.organisation.name,
        videoId: video.id,
      }),
    );
  });
});
