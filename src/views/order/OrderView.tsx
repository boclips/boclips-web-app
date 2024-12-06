import React from 'react';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import { useGetIdFromLocation } from '@src/hooks/useLocationParams';
import { useFindOrGetOrder } from '@src/hooks/api/orderQuery';
import { Loading } from '@components/common/Loading';
import { OrderPage } from '@components/orderPage/OrderPage';
import { ErrorBoundary } from '@components/common/errors/ErrorBoundary';
import RefreshPageError from '@components/common/errors/refreshPageError/RefreshPageError';
import { OrderHeader } from '@components/orderPage/OrderHeader';
import { Helmet } from 'react-helmet';
import { Layout } from '@components/layout/Layout';

const OrderHelmet = ({ orderId }: { orderId?: string }) => {
  return <>{orderId && <Helmet title={`Order ${orderId}`} />}</>;
};

const OrderTable = () => {
  const orderId = useGetIdFromLocation('orders');
  const { data: order, isInitialLoading } = useFindOrGetOrder(orderId);

  if (isInitialLoading)
    return (
      <>
        <OrderHelmet orderId={orderId} />
        <Loading />
      </>
    );

  return (
    <Layout rowsSetup="grid-rows-order-view ">
      <OrderHelmet orderId={orderId} />
      <Navbar />
      <OrderHeader id={order?.id} />
      <ErrorBoundary fallback={<RefreshPageError row="3" />}>
        <OrderPage order={order} />
      </ErrorBoundary>
      <Footer />
    </Layout>
  );
};

export default OrderTable;
