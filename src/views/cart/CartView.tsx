import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import React from 'react';
import { useCartQuery } from '@src/hooks/api/cartQuery';
import { Cart } from '@components/cart/Cart';
import { Loading } from '@components/common/Loading';
import { EmptyCart } from '@components/cart/EmptyCart';
import { Layout } from '@components/layout/Layout';
import PageHeader from '@components/pageTitle/PageHeader';

const CartView = () => {
  const { data: cart, isInitialLoading: isCartLoading } = useCartQuery();
  const hasItemsInCart = cart?.items?.length > 0;

  const cartInfo = hasItemsInCart && (
    <span className="text-2xl font-normal">
      ({cart.items.length} item
      {cart.items.length > 1 ? 's' : ''})
    </span>
  );

  if (isCartLoading) return <Loading />;

  return (
    <Layout rowsSetup="grid-rows-cart-view">
      <Navbar />
      <PageHeader title="Shopping cart" cartItems={cartInfo} />
      {hasItemsInCart ? <Cart cart={cart} /> : <EmptyCart />}
      <Footer />
    </Layout>
  );
};

export default CartView;
