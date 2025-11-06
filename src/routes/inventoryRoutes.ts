import { Router } from 'express';
import { z } from 'zod';
import { DataStore } from '../core/dataStore';
import { listInventorySummary, recordAdjustment, listAdjustments } from '../modules/inventory/inventoryService';

export const createInventoryRouter = (store: DataStore) => {
  const router = Router();

  router.get('/', (_req, res) => {
    const summary = listInventorySummary(store);
    res.json(summary);
  });

  const adjustmentSchema = z.object({
    warehouseId: z.string().uuid(),
    itemId: z.string().uuid(),
    quantity: z.number().int(),
    reason: z.enum(['cycle-count', 'damage', 'transfer', 'manual']),
    note: z.string().optional()
  });

  router.post('/adjustments', (req, res, next) => {
    try {
      const payload = adjustmentSchema.parse(req.body);
      const adjustment = recordAdjustment(store, payload);
      res.status(201).json(adjustment);
    } catch (error) {
      next(error);
    }
  });

  router.get('/adjustments', (req, res) => {
    const { warehouseId, itemId, from, to } = req.query;
    const adjustments = listAdjustments({
      warehouseId: typeof warehouseId === 'string' ? warehouseId : undefined,
      itemId: typeof itemId === 'string' ? itemId : undefined,
      from: typeof from === 'string' ? from : undefined,
      to: typeof to === 'string' ? to : undefined
    });
    res.json(adjustments);
  });

  return router;
};
