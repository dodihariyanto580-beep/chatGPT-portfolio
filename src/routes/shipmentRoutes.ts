import { Router } from 'express';
import { z } from 'zod';
import { DataStore } from '../core/dataStore';
import { createShipment, findLateShipments, listShipments, updateShipmentStatus } from '../modules/shipments/shipmentService';

export const createShipmentRouter = (store: DataStore) => {
  const router = Router();

  router.get('/', (req, res) => {
    const { warehouseId, status, type } = req.query;
    const shipments = listShipments(store, {
      warehouseId: typeof warehouseId === 'string' ? warehouseId : undefined,
      status: typeof status === 'string' ? (status as any) : undefined,
      type: typeof type === 'string' ? (type as any) : undefined
    });
    res.json(shipments);
  });

  router.get('/late', (_req, res) => {
    res.json(findLateShipments(store));
  });

  const lineSchema = z.object({
    itemId: z.string().uuid(),
    quantity: z.number().positive(),
    uom: z.string()
  });

  const shipmentSchema = z.object({
    reference: z.string(),
    type: z.enum(['inbound', 'outbound']),
    status: z.enum(['planned', 'in-progress', 'completed', 'cancelled']).optional(),
    origin: z.string(),
    destination: z.string(),
    scheduledDate: z.string().datetime(),
    actualDate: z.string().datetime().optional(),
    carrier: z.string().optional(),
    notes: z.string().optional(),
    warehouseId: z.string().uuid(),
    lines: z.array(lineSchema).min(1)
  });

  router.post('/', (req, res, next) => {
    try {
      const payload = shipmentSchema.parse(req.body);
      const created = createShipment(store, payload);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  });

  const statusSchema = z.object({
    status: z.enum(['planned', 'in-progress', 'completed', 'cancelled']),
    actualDate: z.string().datetime().optional(),
    carrier: z.string().optional(),
    notes: z.string().optional()
  });

  router.patch('/:id/status', (req, res, next) => {
    try {
      const payload = statusSchema.parse(req.body);
      const updated = updateShipmentStatus(store, req.params.id, payload.status, payload);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
