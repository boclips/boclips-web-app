import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitFor,
  within,
  cleanup,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import React from 'react';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { BoclipsApiErrorFactory } from 'boclips-api-client/dist/test-support/BoclipsApiErrorFactory';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { queryClientConfig } from 'src/hooks/api/queryClientConfig';
import { QueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import userEvent from '@testing-library/user-event';
import { BoclipsSecurity } from 'boclips-js-security/dist/BoclipsSecurity';
import { createReactQueryClient } from 'src/testSupport/createReactQueryClient';
import { lastEvent } from 'src/testSupport/lastEvent';

afterEach(cleanup);

describe('CartView', () => {
  const video = VideoFactory.sample({
    id: 'video-id',
    title: 'news video',
    price: {
      amount: 600,
      currency: 'USD',
    },
    types: [{ name: 'NEWS', id: 2 }],
    maxLicenseDurationYears: 5,
  });
  const instructionalVideo = VideoFactory.sample({
    id: 'instructional-video-id',
    title: 'instructional video',
    price: {
      amount: 400,
      currency: 'USD',
    },
    types: [{ name: 'INSTRUCTIONAL', id: 3 }],
  });
  beforeEach(() => {
    window.resizeTo(1680, 1024);
  });

  it('when no items in cart, displays empty cart view with basic header', async () => {
    const wrapper = await renderCartView(new FakeBoclipsClient());

    expect(await wrapper.findByText('Shopping cart')).toBeInTheDocument();

    expect(await wrapper.queryByText(/items (0)/)).not.toBeInTheDocument();

    expect(
      await wrapper.findByText('Your shopping cart is empty'),
    ).toBeInTheDocument();
  });

  it('when videos in cart, displays video player with information and prices', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.users.setCurrentUserFeatures({
      BO_WEB_APP_REQUEST_ADDITIONAL_EDITING: true,
      BO_WEB_APP_REQUEST_TRIMMING: true,
    });

    fakeClient.videos.insertVideo(video);
    fakeClient.carts.insertCartItem({
      videoId: 'video-id',
      additionalServices: { captionsRequested: true },
    });

    const wrapper = await renderCartView(fakeClient);

    expect(await wrapper.findByText('Shopping cart')).toBeInTheDocument();
    expect(await wrapper.findByText('(1 item)')).toBeInTheDocument();
    expect(await wrapper.findByText('news video')).toBeInTheDocument();
    expect(await wrapper.findByText('video-id')).toBeInTheDocument();
    expect(
      await wrapper.findByText('Can be licensed for a maximum of 5 years'),
    ).toBeInTheDocument();
    expect(await wrapper.findByText('Additional services')).toBeInTheDocument();
    expect(await wrapper.findByText('Trim video')).toBeInTheDocument();
    (await wrapper.findAllByTestId('price-badge')).map((badge) =>
      expect(badge.innerHTML).toEqual('$600'),
    );
    expect(wrapper.getByTestId('additional-services-summary')).toBeVisible();
    expect(
      wrapper.getByText(
        'Note: human-generated captions can take approx. 3 days to be ready for use.',
      ),
    ).toBeVisible();
  });

  it('displays order confirmation modal when place order button clicked', async () => {
    const fakeClient = new FakeBoclipsClient();

    fakeClient.videos.insertVideo(video);
    fakeClient.videos.insertVideo(instructionalVideo);
    fakeClient.carts.insertCartItem({
      videoId: 'video-id',
    });
    fakeClient.carts.insertCartItem({
      videoId: 'instructional-video-id',
      additionalServices: { captionsRequested: true },
    });
    fakeClient.users.setCurrentUserFeatures({
      BO_WEB_APP_REQUEST_TRIMMING: true,
      BO_WEB_APP_PRICES: true,
    });

    const wrapper = render(
      <MemoryRouter initialEntries={['/cart']}>
        <App
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={new QueryClient(queryClientConfig)}
        />
      </MemoryRouter>,
    );

    await waitFor(() => wrapper.getByText('Place order')).then((it) => {
      fireEvent.click(it);
    });

    await waitFor(() => wrapper.getByTestId('order-modal')).then((it) => {
      expect(within(it).getByText('news video')).toBeVisible();
      expect(within(it).getByText('Confirm order')).toBeVisible();
      expect(within(it).getByText('$600')).toBeVisible();
      expect(within(it).getByText('$400')).toBeVisible();
      expect(within(it).getByText('Go back to cart')).toBeVisible();
      expect(
        within(it).getByTestId('additional-services-summary'),
      ).toBeVisible();
      expect(
        within(it).getByText(
          'Note: human-generated captions can take approx. 3 days to be ready for use.',
        ),
      ).toBeVisible();
    });

    expect(lastEvent(fakeClient)).toEqual({
      type: 'PLATFORM_INTERACTED_WITH',
      subtype: 'ORDER_CONFIRMATION_MODAL_OPENED',
      anonymous: false,
    });
  });

  it('does not display additional services message in order modal if none selected', async () => {
    const fakeClient = new FakeBoclipsClient();

    fakeClient.videos.insertVideo(video);
    fakeClient.carts.insertCartItem({
      videoId: 'video-id',
      additionalServices: {
        captionsRequested: false,
        transcriptRequested: false,
        trim: null,
        editRequest: null,
      },
    });

    const wrapper = await renderCartView(fakeClient);

    const placeOrder = await wrapper.findByText('Place order');
    act(() => {
      fireEvent.click(placeOrder);
    });

    const modal = await wrapper.findByTestId('order-modal');
    expect(await within(modal).findByText('news video')).toBeVisible();
    expect(
      await within(modal).queryByTestId('additional-services-summary'),
    ).toBeNull();
  });

  it('places order when confirmation button is clicked', async () => {
    const fakeClient = new FakeBoclipsClient();

    fakeClient.users.insertCurrentUser(UserFactory.sample({ id: 'user-id' }));
    fakeClient.videos.insertVideo(video);
    fakeClient.carts.insertCartItem({ videoId: 'video-id' });

    const wrapper = await renderCartView(fakeClient);
    await placeAndConfirmOrder(wrapper);

    await waitFor(() => wrapper.getByText('Your order is confirmed'));

    expect(lastEvent(fakeClient, 'PLATFORM_INTERACTED_WITH')).toEqual({
      type: 'PLATFORM_INTERACTED_WITH',
      subtype: 'ORDER_CONFIRMED',
      anonymous: false,
    });
  });

  it('has the cart summary', async () => {
    const fakeClient = new FakeBoclipsClient();

    fakeClient.videos.insertVideo(
      VideoFactory.sample({
        price: { amount: 300, currency: 'USD' },
        id: 'video-id-1',
      }),
    );

    fakeClient.videos.insertVideo(
      VideoFactory.sample({
        price: { amount: 600, currency: 'USD' },
        id: 'video-id-2',
      }),
    );

    fakeClient.carts.insertCartItem({
      videoId: 'video-id-1',
      additionalServices: {
        captionsRequested: true,
        transcriptRequested: true,
        trim: {
          to: '1:00',
          from: '3:00',
        },
        editRequest: 'some lovely editing',
      },
    });
    fakeClient.carts.insertCartItem({
      videoId: 'video-id-2',
      additionalServices: { transcriptRequested: false },
    });

    const wrapper = await renderCartView(fakeClient);

    await waitFor(async () => {
      expect(
        await wrapper.findByText(' total', { exact: false }),
      ).toBeVisible();
      expect(
        await within(await wrapper.findByTestId('total-price')).findByText(
          '$900',
        ),
      ).toBeVisible();
    });

    expect(await wrapper.findByText('Captions and transcripts')).toBeVisible();
    expect(await wrapper.findByText('Trimming')).toBeVisible();
    expect(await wrapper.findByText('Editing')).toBeVisible();
    expect(await wrapper.findByText('Total')).toBeVisible();
  });

  it('removes item from cart', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.videos.insertVideo(video);
    fakeClient.carts.insertCartItem({ videoId: video.id });

    const wrapper = await renderCartView(fakeClient);
    const removeButton = await wrapper.findByText('Remove');
    fireEvent.click(removeButton);
    expect(
      await wrapper.findByText('Your shopping cart is empty'),
    ).toBeInTheDocument();
  });

  it('takes you back to video page when cart item title is clicked', async () => {
    const fakeClient = new FakeBoclipsClient();

    fakeClient.videos.insertVideo(video);
    fakeClient.carts.insertCartItem({ videoId: 'video-id' });

    const wrapper = await renderCartView(fakeClient);

    const title = await wrapper.findByText('news video');

    expect(title.closest('a')).toHaveAttribute('href', `/videos/${video.id}`);
  });

  it(`displays access denied if user has BOCLIPS_WEB_APP_BROWSE role`, async () => {
    const fakeClient = new FakeBoclipsClient();
    const security: BoclipsSecurity = {
      ...stubBoclipsSecurity,
      hasRole: (role) => role === 'BOCLIPS_WEB_APP_BROWSE',
    };

    const wrapper = render(
      <MemoryRouter initialEntries={['/cart']}>
        <App
          apiClient={fakeClient}
          boclipsSecurity={security}
          reactQueryClient={createReactQueryClient()}
        />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Page not found!')).toBeVisible();
  });

  describe('interacting with additional services', () => {
    it('adds additional services to the cart summary when selected', async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.users.setCurrentUserFeatures({
        BO_WEB_APP_REQUEST_TRIMMING: true,
        BO_WEB_APP_REQUEST_ADDITIONAL_EDITING: true,
        BO_WEB_APP_PRICES: true,
      });

      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          price: { amount: 300, currency: 'USD' },
          id: 'video-additional-service',
        }),
      );

      fakeClient.carts.insertCartItem({
        videoId: 'video-additional-service',
        additionalServices: {},
      });

      const wrapper = await renderCartView(fakeClient);

      expect(await wrapper.findByText('Shopping cart')).toBeInTheDocument();
      expect(
        await wrapper.queryByText('Captions and transcripts'),
      ).not.toBeInTheDocument();
      expect(await wrapper.queryByText('Editing')).not.toBeInTheDocument();
      expect(await wrapper.queryByText('Trimming')).not.toBeInTheDocument();

      fireEvent.click(
        await wrapper.findByText('Request other type of editing'),
      );

      const input = await wrapper.findByPlaceholderText(
        'eg. Remove front and end credits',
      );

      fireEvent.change(input, {
        target: { value: 'please do some lovely editing' },
      });

      fireEvent.click(
        await wrapper.findByText('Request English Caption and Transcript file'),
      );
      fireEvent.click(await wrapper.findByText('Trim video'));

      fireEvent.change(await wrapper.findByLabelText('trim-from'), {
        target: { value: '0:02' },
      });

      fireEvent.blur(await wrapper.findByLabelText('trim-from'));

      fireEvent.change(await wrapper.findByLabelText('trim-to'), {
        target: { value: '0:03' },
      });

      fireEvent.blur(await wrapper.findByLabelText('trim-to'));

      await waitFor(async () => {
        expect(
          await wrapper.findByText('Captions and transcripts'),
        ).toBeVisible();
        expect(await wrapper.findByText('Editing')).toBeVisible();
        expect(await wrapper.findByText('Trimming')).toBeVisible();
      });
    });

    it('displays error when trying to place order with invalid trim values and then removes the error when trim becomes valid again', async () => {
      const fakeClient = new FakeBoclipsClient();
      jest.spyOn(fakeClient.carts, 'updateCartItemAdditionalServices');
      fakeClient.users.setCurrentUserFeatures({
        BO_WEB_APP_REQUEST_TRIMMING: true,
      });

      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          price: { amount: 300, currency: 'USD' },
          id: 'video-additional-service',
        }),
      );

      fakeClient.carts.insertCartItem({
        videoId: 'video-additional-service',
        additionalServices: {},
      });

      const wrapper = await renderCartView(fakeClient);

      fireEvent.click(await wrapper.findByText('Trim video'));

      fireEvent.focus(await wrapper.findByLabelText('trim-from'));
      fireEvent.blur(await wrapper.findByLabelText('trim-from'));
      fireEvent.change(await wrapper.findByLabelText('trim-from'), {
        target: { value: '-2' },
      });

      fireEvent.click(await wrapper.findByText('Place order'));
      expect(
        await wrapper.findByText(
          'There are some errors. Please review your shopping cart and correct the mistakes.',
        ),
      ).toBeVisible();

      expect(
        fakeClient.carts.updateCartItemAdditionalServices,
      ).toHaveBeenCalledTimes(0);

      expect(
        await wrapper.findByText('Specify your trimming options'),
      ).toBeVisible();

      fireEvent.change(await wrapper.findByLabelText('trim-from'), {
        target: { value: '0:00' },
      });
      fireEvent.change(await wrapper.findByLabelText('trim-to'), {
        target: { value: '0:05' },
      });

      expect(
        wrapper.queryByText(
          'There are some errors. Please review your shopping cart and correct the mistakes.',
        ),
      ).not.toBeInTheDocument();
    });

    it('displays error when leaving empty edit request and then removes the error when trim becomes valid again', async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.users.setCurrentUserFeatures({
        BO_WEB_APP_REQUEST_ADDITIONAL_EDITING: true,
      });

      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          price: { amount: 300, currency: 'USD' },
          id: 'video-additional-service',
        }),
      );

      fakeClient.carts.insertCartItem({
        videoId: 'video-additional-service',
        additionalServices: {},
      });

      const wrapper = await renderCartView(fakeClient);

      fireEvent.click(
        await wrapper.findByText('Request other type of editing'),
      );

      const input = await wrapper.findByPlaceholderText(
        'eg. Remove front and end credits',
      );

      fireEvent.focus(input);
      fireEvent.blur(input);
      fireEvent.click(await wrapper.findByText('Place order'));
      expect(
        await wrapper.findByText(
          'There are some errors. Please review your shopping cart and correct the mistakes.',
        ),
      ).toBeVisible();

      expect(
        await wrapper.findByText('Specify your editing requirements'),
      ).toBeVisible();

      fireEvent.change(input, {
        target: { value: 'please do some lovely editing' },
      });

      expect(
        wrapper.queryByText(
          'There are some errors. Please review your shopping cart and correct the mistakes.',
        ),
      ).not.toBeInTheDocument();
    });

    it('allows an order to be placed when trim is ticked but never touched', async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.users.setCurrentUserFeatures({
        BO_WEB_APP_REQUEST_TRIMMING: true,
      });

      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          price: { amount: 300, currency: 'USD' },
          id: 'video-additional-service',
        }),
      );

      fakeClient.carts.insertCartItem({
        videoId: 'video-additional-service',
        additionalServices: {},
      });

      const wrapper = await renderCartView(fakeClient);

      fireEvent.click(await wrapper.findByText('Trim video'));

      fireEvent.click(await wrapper.findByText('Place order'));
      expect(
        wrapper.queryByText(
          'There are some errors. Please review your shopping cart and correct the mistakes.',
        ),
      ).not.toBeInTheDocument();

      expect(
        await wrapper.findByText(
          'Please confirm you want to place the following order:',
        ),
      ).toBeVisible();

      expect(
        await wrapper.findByText('No additional services selected'),
      ).toBeVisible();
    });

    it('allows an order to be placed when edit request is ticked but never touched', async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.users.setCurrentUserFeatures({
        BO_WEB_APP_REQUEST_ADDITIONAL_EDITING: true,
      });

      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          price: { amount: 300, currency: 'USD' },
          id: 'video-additional-service',
        }),
      );

      fakeClient.carts.insertCartItem({
        videoId: 'video-additional-service',
        additionalServices: {},
      });

      const wrapper = await renderCartView(fakeClient);

      fireEvent.click(
        await wrapper.findByText('Request other type of editing'),
      );

      fireEvent.click(await wrapper.findByText('Place order'));
      expect(
        wrapper.queryByText(
          'There are some errors. Please review your shopping cart and correct the mistakes.',
        ),
      ).not.toBeInTheDocument();

      expect(
        await wrapper.findByText(
          'Please confirm you want to place the following order:',
        ),
      ).toBeVisible();

      expect(
        await wrapper.findByText('No additional services selected'),
      ).toBeVisible();
    });

    it('prevents from typing non digit or colon characters', async () => {
      const fakeClient = new FakeBoclipsClient();

      fakeClient.users.setCurrentUserFeatures({
        BO_WEB_APP_REQUEST_TRIMMING: true,
      });

      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          price: { amount: 300, currency: 'USD' },
          id: 'video-additional-service',
        }),
      );

      fakeClient.carts.insertCartItem({
        videoId: 'video-additional-service',
        additionalServices: {},
      });

      const wrapper = await renderCartView(fakeClient);

      fireEvent.click(await wrapper.findByText('Trim video'));

      fireEvent.focus(await wrapper.findByLabelText('trim-from'));

      await userEvent.type(wrapper.getByLabelText('trim-from'), 'k1a2:30s');

      expect(
        (wrapper.getByLabelText('trim-from') as HTMLInputElement).value,
      ).toEqual('12:30');
    });

    it('displays error page when error while placing order', async () => {
      const originalConsoleError = console.error;
      console.error = () => {};

      const fakeClient = new FakeBoclipsClient();

      fakeClient.users.insertCurrentUser(UserFactory.sample({ id: 'user-id' }));
      fakeClient.videos.insertVideo(video);
      fakeClient.carts.insertCartItem({ videoId: 'video-id' });
      fakeClient.orders.rejectNextPlaceOrder(
        BoclipsApiErrorFactory.sample({ message: 'channel is missing price' }),
      );

      const wrapper = await renderCartView(fakeClient);
      await placeAndConfirmOrder(wrapper);

      expect(
        await wrapper.findByText(/There was an error processing your request/),
      ).toBeVisible();
      console.error = originalConsoleError;
    });

    it('displays a notes field', async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.carts.insertCartItem({ videoId: 'video-id' });

      const wrapper = await renderCartView(fakeClient);

      expect(
        await wrapper.findByPlaceholderText('Add a note about this order'),
      ).toBeVisible();
    });

    it('saves a note on the cart', async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.carts.insertCartItem({ videoId: 'video-id' });

      const wrapper = await renderCartView(fakeClient);

      const input = await wrapper.findByPlaceholderText(
        'Add a note about this order',
      );

      fireEvent.change(input, { target: { value: 'i am a note' } });
      const changedInput = await wrapper.findByDisplayValue('i am a note');
      expect(changedInput).toBeVisible();

      const cart = await fakeClient.carts.getCart();

      await waitFor(() => {
        expect(cart.note).toEqual('i am a note');
      });
    });
  });

  describe(`additional editing options`, () => {
    it(`only displays editing options that user has enabled by feature flag`, async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.videos.insertVideo(video);
      fakeClient.carts.insertCartItem({ videoId: 'video-id' });
      fakeClient.users.setCurrentUserFeatures({
        BO_WEB_APP_REQUEST_TRIMMING: false,
        BO_WEB_APP_REQUEST_ADDITIONAL_EDITING: true,
      });

      const wrapper = await renderCartView(fakeClient);

      expect(
        await wrapper.findByText('Request English Caption and Transcript file'),
      ).toBeVisible();
      expect(await wrapper.queryByText('Trim video')).toBeNull();
      expect(
        await wrapper.findByText('Request other type of editing'),
      ).toBeVisible();
    });
  });

  describe('window titles', () => {
    it('displays Cart as window title', async () => {
      render(
        <MemoryRouter initialEntries={['/cart']}>
          <App
            boclipsSecurity={stubBoclipsSecurity}
            apiClient={new FakeBoclipsClient()}
          />
        </MemoryRouter>,
      );

      const helmet = Helmet.peek();

      await waitFor(() => {
        expect(helmet.title).toEqual('Cart');
      });
    });
  });
});

async function placeAndConfirmOrder(wrapper: RenderResult) {
  await wrapper.findByText('Place order');
  fireEvent.click(wrapper.getByText('Place order'));

  const modal = await wrapper.findByTestId('order-modal');

  await waitFor(async () =>
    expect(
      within(modal).getByText('Confirm order').closest('button'),
    ).not.toBeDisabled(),
  );

  await within(modal)
    .findByText('Confirm order')
    .then((button) => fireEvent.click(button));
}

async function renderCartView(client: FakeBoclipsClient) {
  const wrapper = render(
    <MemoryRouter initialEntries={['/cart']}>
      <App
        apiClient={client}
        boclipsSecurity={stubBoclipsSecurity}
        reactQueryClient={new QueryClient(queryClientConfig)}
      />
    </MemoryRouter>,
  );

  await wrapper.findByText('Loading');

  return wrapper;
}
