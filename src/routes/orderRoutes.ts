import { Router } from 'express';
import { z } from 'zod';
import { DataStore } from '../core/dataStore';
import { createOrder, listOrders, updateOrderStatus } from '../modules/orders/orderService';

export const createOrderRouter = (store: DataStore) => {
  const router = Router();

  router.get('/', (req, res) => {
    const { warehouseId, status, type } = req.query;
    const orders = listOrders(store, {
      warehouseId: typeof warehouseId === 'string' ? warehouseId : undefined,
      status: typeof status === 'string' ? (status as any) : undefined,
      type: typeof type === 'string' ? (type as any) : undefined
    });
    res.json(orders);
  });

  const lineSchema = z.object({
    itemId: z.string().uuid(),
    quantity: z.number().positive(),
    unitPrice: z.number().nonnegative()
  });

  const orderSchema = z.object({
    orderNumber: z.string(),
    type: z.enum(['purchase', 'transfer', 'sales']),
    status: z.enum(['draft', 'approved', 'receiving', 'fulfilled', 'closed']).optional(),
    supplierOrCustomer: z.string(),
    expectedDate: z.string().datetime(),
    warehouseId: z.string().uuid(),
    lines: z.array(lineSchema).min(1)
  });

  router.post('/', (req, res, next) => {
    try {
      const payload = orderSchema.parse(req.body);
      const order = createOrder(store, payload);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  });

  const statusSchema = z.object({
    status: z.enum(['draft', 'approved', 'receiving', 'fulfilled', 'closed'])
  });

  router.patch('/:id/status', (req, res, next) => {
    try {
      const payload = statusSchema.parse(req.body);
      const order = updateOrderStatus(store, req.params.id, payload.status);
      res.json(order);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
