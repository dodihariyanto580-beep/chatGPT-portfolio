import { Router } from 'express';
import { z } from 'zod';
import { DataStore } from '../core/dataStore';
import { createWarehouse, listWarehouses, updateWarehouse } from '../modules/warehouses/warehouseService';

export const createWarehouseRouter = (store: DataStore) => {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json(listWarehouses(store));
  });

  const baseSchema = z.object({
    code: z.string(),
    name: z.string(),
    location: z.string(),
    capacityCbm: z.number().nonnegative(),
    temperatureControlled: z.boolean(),
    remarks: z.string().optional()
  });

  router.post('/', (req, res, next) => {
    try {
      const payload = baseSchema.parse(req.body);
      const created = createWarehouse(store, payload);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  });

  router.patch('/:id', (req, res, next) => {
    try {
      const payload = baseSchema.partial().parse(req.body);
      const updated = updateWarehouse(store, req.params.id, payload);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
