import React from 'react';
import List from 'antd/lib/list';
import { OrdersCard } from 'src/components/ordersTable/OrdersCard';
import { Order } from 'boclips-api-client/dist/sub-clients/orders/model/Order';
import { PaginationButtons } from 'src/components/common/PaginationButtons';
import s from '../common/pagination.module.less';

interface Props {
  orders: any;
  paginationPage: any;
}

export const OrdersTable = ({ orders, paginationPage }: Props) => {
  const handlePageChange = (newPage: number) => {
    window.scrollTo({ top: 0 });
    paginationPage(newPage - 1);
  };

  return (
    <div className="col-start-2 col-end-26 row-start-3 row-end-4 flex items-center">
      <List
        className="w-full"
        itemLayout="vertical"
        size="large"
        pagination={{
          total: orders.page.totalElements,
          pageSize: 10,
          showSizeChanger: false,
          onChange: handlePageChange,
          current: orders.page.number + 1,
          className: s.pagination,
          itemRender: PaginationButtons,
        }}
        dataSource={orders.orders}
        renderItem={(order: Order) => <OrdersCard order={order} />}
      />
    </div>
  );
};
