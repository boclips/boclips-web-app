import React, { useState } from 'react';
import Navbar from '@src/components/layout/Navbar';
import Footer from '@src/components/layout/Footer';
import { OrdersTable } from '@src/components/ordersTable/OrdersTable';
import { useGetOrdersQuery } from '@src/hooks/api/orderQuery';
import { Loading } from '@src/components/common/Loading';
import { ErrorBoundary } from '@src/components/common/errors/ErrorBoundary';
import RefreshPageError from '@src/components/common/errors/refreshPageError/RefreshPageError';
import EmptyOrdersSVG from '@resources/icons/empty-order-history.svg?react';
import { Layout } from '@src/components/layout/Layout';
import { Hero as OrdersEmptyState } from '@src/components/hero/Hero';
import PageHeader from '@src/components/pageTitle/PageHeader';

export const PAGE_SIZE = 10;

const OrdersView = () => {
  const [page, setPage] = useState<number>(0);

  const { isInitialLoading, data: orders } = useGetOrdersQuery({
    page,
    size: PAGE_SIZE,
  });

  const changePaginationPage = (pageNum) => {
    setPage(pageNum);
  };

  const hasOrders = orders?.page.length > 0;

  if (isInitialLoading && !hasOrders) return <Loading />;

  return (
    <Layout rowsSetup="grid-rows-orders-view">
      <Navbar />
      <PageHeader title="My Orders" />
      {hasOrders ? (
        <ErrorBoundary fallback={<RefreshPageError row="3" />}>
          <OrdersTable paginationPage={changePaginationPage} orders={orders} />
        </ErrorBoundary>
      ) : (
        <OrdersEmptyState
          row="3"
          icon={<EmptyOrdersSVG />}
          title="You have no order history... yet!"
          description="But when you order something, you can keep track of all your orders here."
        />
      )}
      <Footer />
    </Layout>
  );
};

export default OrdersView;
