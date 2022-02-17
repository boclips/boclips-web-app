import React from 'react';
import List from 'antd/lib/list';
import { OrdersCard } from 'src/components/ordersTable/OrdersCard';
import { Order } from 'boclips-api-client/dist/sub-clients/orders/model/Order';
import c from 'classnames';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import Pageable from 'boclips-api-client/dist/sub-clients/common/model/Pageable';
import Pagination from '@boclips-ui/pagination';
import s from '../common/pagination/pagination.module.less';

interface Props {
  orders: Pageable<Order>;
  paginationPage: any;
}

export const OrdersTable = ({ orders, paginationPage }: Props) => {
  const handlePageChange = (newPage: number) => {
    window.scrollTo({ top: 0 });
    paginationPage(newPage - 1);
  };

  const currentBreakpoint = useMediaBreakPoint();
  const mobileView = currentBreakpoint.type === 'mobile';

  const itemRender = React.useCallback(
    (page, type) => (
      <Pagination
        buttonType={type}
        page={page}
        mobileView={mobileView}
        currentPage={orders.pageSpec.number + 1}
        totalItems={orders.pageSpec.totalPages}
      />
    ),
    [mobileView, orders.pageSpec.number, orders.pageSpec.totalPages],
  );

  return (
    <main className="col-start-2 col-end-26 row-start-3 row-end-4 flex items-center">
      <List
        className="w-full"
        itemLayout="vertical"
        size="large"
        pagination={{
          total: orders.pageSpec.totalElements,
          pageSize: 10,
          hideOnSinglePage: true,
          showSizeChanger: false,
          onChange: handlePageChange,
          current: orders.pageSpec.number + 1,
          className: c(s.pagination, {
            [s.paginationEmpty]: !orders.pageSpec.totalElements,
          }),
          showLessItems: mobileView,
          prefixCls: 'bo-pagination',
          itemRender,
        }}
        dataSource={orders.page}
        renderItem={(order: Order) => <OrdersCard order={order} />}
      />
    </main>
  );
};
