import React, { useEffect } from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Link, useHistory } from 'react-router-dom';
import { Layout } from 'src/components/layout/Layout';
import Button from '@boclips-ui/button';
import { Hero } from 'src/components/hero/Hero';
import OrderConfirmedSVG from 'src/resources/icons/order-confirmed.svg';
import { Typography } from '@boclips-ui/typography';

interface OrderConfirmedInterface {
  state: any;
}

const OrderConfirmationView = ({ state }: OrderConfirmedInterface) => {
  const history = useHistory();

  useEffect(() => {
    if (!state || !state.orderLocation) {
      history.push('/');
    }
  }, [state, history]);

  const orderId = state?.orderLocation.substring(
    state.orderLocation.lastIndexOf('/') + 1,
  );

  if (!state || !state.orderLocation) return null;

  return (
    <Layout rowsSetup="grid-rows-home">
      <Navbar />
      <Hero
        title="Your order is confirmed"
        icon={<OrderConfirmedSVG />}
        description={
          <>
            Your order #<span data-qa="placed-order-id">{orderId}</span> is
            currently being processed. We’ve sent you an email with your order
            confirmation.
          </>
        }
        moreDescription="You can track and review all orders in your account"
        actions={
          <>
            <Button
              onClick={() => {
                history.push({
                  pathname: `/orders/${orderId}`,
                });
              }}
              text="View order details"
              height="44px"
              width="170px"
            />
            <Link className="ml-6" to="/orders" data-qa="view-orders">
              <Typography.Body weight="medium">View all orders</Typography.Body>
            </Link>
          </>
        }
      />
      <Footer />
    </Layout>
  );
};

export default OrderConfirmationView;
