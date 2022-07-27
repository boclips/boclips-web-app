import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Cart } from 'boclips-api-client/dist/sub-clients/carts/model/Cart';
import { CartItem } from 'boclips-api-client/dist/sub-clients/carts/model/CartItem';
import { AdditionalServices } from 'boclips-api-client/dist/sub-clients/carts/model/AdditionalServices';
import { BoclipsClient } from 'boclips-api-client';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { Video } from 'boclips-api-client/dist/types';

const doGetCart = (client: BoclipsClient) => client.carts.getCart();

export const doAddToCart = (
  cart: Cart,
  videoId: string,
  client: BoclipsClient,
) => client.carts.addItemToCart(cart, videoId);

export const doDeleteFromCart = (
  cart: Cart,
  cartItemId: string,
  client: BoclipsClient,
) => client.carts.deleteItemFromCart(cart, cartItemId).then((_) => cartItemId);

export const doUpdateCartItem = (
  cartItem: CartItem,
  additionalServices: AdditionalServices,
  client: BoclipsClient,
) => {
  client.carts.updateCartItemAdditionalServices(cartItem, additionalServices);
};

export const useCartQuery = () => {
  const client = useBoclipsClient();
  return useQuery(['cart'], () => doGetCart(client));
};

export const doUpdateCartNote = (note: string, client: BoclipsClient) =>
  client.carts.updateCart(note);

interface AdditionalServicesUpdateRequest {
  cartItem: CartItem;
  additionalServices: AdditionalServices;
}

interface CartMutationCallbacks {
  onSuccess?: (cartItemId: string) => void;
  onError?: (cartItemId: string) => void;
}

export const useCartItemAdditionalServicesMutation = () => {
  const boclipsClient = useBoclipsClient();
  const queryClient = useQueryClient();
  return useMutation(
    async (
      additionalServicesUpdateRequest: AdditionalServicesUpdateRequest,
    ) => {
      return doUpdateCartItem(
        additionalServicesUpdateRequest.cartItem,
        additionalServicesUpdateRequest.additionalServices,
        boclipsClient,
      );
    },
    {
      onMutate: async (
        additionalServicesUpdateRequest: AdditionalServicesUpdateRequest,
      ) => {
        await queryClient.cancelQueries(['cart']);

        queryClient.setQueryData(['cart'], (old: Cart) => {
          return {
            ...old,
            items: old?.items
              ? [
                  ...old.items.map((it) => {
                    if (it.id === additionalServicesUpdateRequest.cartItem.id) {
                      return {
                        ...it,
                        additionalServices: {
                          ...it.additionalServices,
                          ...additionalServicesUpdateRequest.additionalServices,
                        },
                      };
                    }
                    return it;
                  }),
                ]
              : [],
          };
        });
      },
    },
  );
};

export const useCartMutation = (callbacks?: CartMutationCallbacks) => {
  const boclipsClient = useBoclipsClient();
  const queryClient = useQueryClient();
  const { data: cart } = useCartQuery();

  return useMutation(
    async (cartItemId: string) => {
      return doDeleteFromCart(cart as Cart, cartItemId, boclipsClient);
    },
    {
      onMutate: async (cartItemId) => {
        await queryClient.cancelQueries(['cart']);
        await queryClient.cancelQueries(['cartItemVideos']);

        const cartItemToRemove = queryClient
          .getQueryData<Cart>(['cart'])
          .items.find((it) => it.id === cartItemId);

        queryClient.setQueryData(['cart'], (old: Cart) => ({
          ...old,
          items: [...old.items.filter((item) => item.id !== cartItemId)],
        }));

        queryClient.setQueryData(['multipleVideos'], (videos: Video[]) => [
          ...(videos || []).filter((item) => {
            return item.id !== cartItemToRemove.videoId;
          }),
        ]);
      },
      onSuccess: (_, cartItemId: string) => {
        if (callbacks?.onSuccess) {
          callbacks.onSuccess(cartItemId);
        }
      },
      onError: (_, cartItemId: string) => {
        if (callbacks?.onError) {
          callbacks.onError(cartItemId);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(['cart']);
      },
    },
  );
};
