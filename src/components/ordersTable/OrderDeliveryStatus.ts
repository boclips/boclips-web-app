import { OrderStatus } from 'boclips-api-client/dist/sub-clients/orders/model/Order';

export const orderDeliveryStatus = new Map([
  [OrderStatus.READY, 'READY'],
  [OrderStatus.INVALID, 'ERROR'],
  [OrderStatus.IN_PROGRESS, 'PROCESSING'],
  [OrderStatus.INCOMPLETED, 'PROCESSING'],
  [OrderStatus.CANCELLED, 'CANCELLED'],
  [OrderStatus.DELIVERED, 'PROCESSING'],
]);
