import React from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { useGetIdFromLocation } from 'src/hooks/useLocationParams';
import { useFindOrGetOrder } from 'src/hooks/api/orderQuery';
import { Loading } from 'src/components/common/Loading';
import { OrderPage } from 'src/components/orderPage/OrderPage';
import { ErrorBoundary } from 'src/components/common/errors/ErrorBoundary';
import RefreshPageError from 'src/components/common/errors/refreshPageError/RefreshPageError';
import { OrderHeader } from 'src/components/orderPage/OrderHeader';
import { Helmet } from 'react-helmet';
import { Layout } from 'src/components/layout/Layout';

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
