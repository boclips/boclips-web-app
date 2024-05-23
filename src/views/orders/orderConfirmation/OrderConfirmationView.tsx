import React, { useEffect } from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from 'src/components/layout/Layout';
import Button from '@boclips-ui/button';
import { Hero } from 'src/components/hero/Hero';
import OrderConfirmedSVG from 'src/resources/icons/order-confirmed.svg';
import { Typography } from '@boclips-ui/typography';
import { Helmet } from 'react-helmet';
import useFeatureFlags from 'src/hooks/useFeatureFlags';
import { FeatureGate } from 'src/components/common/FeatureGate';

const OrderConfirmationView = () => {
  const { features, isLoading } = useFeatureFlags();
  const navigate = useNavigate();
  const state = useLocation()?.state;

  const orderDescription =
    'You can track and review all orders in your account.';
  const myContentDescription = `${orderDescription} You can view and retrieve all purchased videos in your Content area once your order has been processed and your content license generated.`;

  const orderConfirmationDescription = () =>
    !isLoading && features.BO_WEB_APP_DEV
      ? myContentDescription
      : orderDescription;

  const viewMyContentLink = () => (
    <Link className="ml-6" to="/content" data-qa="view-orders">
      <Typography.Body weight="medium">View licenses</Typography.Body>
    </Link>
  );

  const viewAllOrderLink = () => (
    <Link className="ml-6" to="/orders" data-qa="view-orders">
      <Typography.Body weight="medium">View all orders</Typography.Body>
    </Link>
  );

  useEffect(() => {
    if (!state || !state.orderLocation) {
      navigate('/');
    }
  }, [state]);

  const orderId = state?.orderLocation.substring(
    state.orderLocation.lastIndexOf('/') + 1,
  );

  if (!state || !state.orderLocation) return null;

  return (
    <>
      <Helmet title="Order confirmed!" />
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
          moreDescription={orderConfirmationDescription()}
          actions={
            <>
              <Button
                onClick={() => {
                  navigate({
                    pathname: `/orders/${orderId}`,
                  });
                }}
                text="View order details"
                height="44px"
                width="170px"
              />
              <FeatureGate
                feature="BO_WEB_APP_DEV"
                fallback={viewAllOrderLink()}
              >
                {viewMyContentLink()}
              </FeatureGate>
            </>
          }
        />
        <Footer />
      </Layout>
    </>
  );
};
export default OrderConfirmationView;
