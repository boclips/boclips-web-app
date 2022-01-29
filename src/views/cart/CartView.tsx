import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import React from 'react';
import { useCartQuery } from 'src/hooks/api/cartQuery';
import { Cart } from 'src/components/cart/Cart';
import { Loading } from 'src/components/common/Loading';
import { EmptyCart } from 'src/components/cart/EmptyCart';
import { useGetVideos } from 'src/hooks/api/videoQuery';
import { Layout } from 'src/components/layout/Layout';
import PageHeader from 'src/components/pageTitle/PageHeader';

const CartView = () => {
  const { data: cart, isLoading: isCartLoading } = useCartQuery();
  const videoIds = cart?.items?.map((it) => it.videoId);

  const {
    data: cartItemVideos,
    isLoading: isCartItemVideosLoading,
  } = useGetVideos(videoIds);

  const itemsInCart = cart?.items?.length > 0;

  const cartInfo = itemsInCart && (
    <span className="text-2xl font-normal">
      ({cart.items.length} item
      {cart.items.length > 1 ? 's' : ''})
    </span>
  );

  if (isCartLoading || isCartItemVideosLoading || !videoIds) return <Loading />;

  return (
    <Layout rowsSetup="grid-rows-default-view-with-title">
      <Navbar />
      <PageHeader title="Shopping cart" cartItems={cartInfo} />
      {itemsInCart && videoIds ? (
        <Cart cart={cart} cartItemVideos={cartItemVideos} />
      ) : (
        <EmptyCart />
      )}
      <Footer />
    </Layout>
  );
};

export default CartView;
