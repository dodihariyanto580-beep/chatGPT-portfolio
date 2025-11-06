import { randomUUID } from 'node:crypto';
import { DataStore } from '../../core/dataStore';
import { Order, OrderStatus, OrderType } from '../../core/types';

export interface OrderFilters {
  warehouseId?: string;
  status?: OrderStatus;
  type?: OrderType;
}

export const listOrders = (store: DataStore, filters: OrderFilters = {}): Order[] => {
  return store.orders.filter((order) => {
    if (filters.warehouseId && order.warehouseId !== filters.warehouseId) return false;
    if (filters.status && order.status !== filters.status) return false;
    if (filters.type && order.type !== filters.type) return false;
    return true;
  });
};

export interface OrderInput extends Omit<Order, 'id' | 'createdAt' | 'status'> {
  status?: OrderStatus;
}

export const createOrder = (store: DataStore, payload: OrderInput): Order => {
  const order: Order = {
    ...payload,
    id: randomUUID(),
    status: payload.status ?? 'draft',
    createdAt: new Date().toISOString()
  };
  store.orders.push(order);
  return order;
};

export const updateOrderStatus = (store: DataStore, orderId: string, status: OrderStatus): Order => {
  const order = store.orders.find((o) => o.id === orderId);
  if (!order) {
    throw new Error('Order not found');
  }
  order.status = status;
  return order;
};
