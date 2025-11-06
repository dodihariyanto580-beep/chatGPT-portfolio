import { Router } from 'express';
import { z } from 'zod';
import { DataStore } from '../core/dataStore';
import { createTask, listTasks, updateTaskStatus } from '../modules/tasks/taskService';

export const createTaskRouter = (store: DataStore) => {
  const router = Router();

  router.get('/', (req, res) => {
    const { warehouseId, status, type } = req.query;
    const tasks = listTasks(store, {
      warehouseId: typeof warehouseId === 'string' ? warehouseId : undefined,
      status: typeof status === 'string' ? (status as any) : undefined,
      type: typeof type === 'string' ? (type as any) : undefined
    });
    res.json(tasks);
  });

  const baseSchema = z.object({
    warehouseId: z.string().uuid(),
    shipmentId: z.string().uuid().optional(),
    orderId: z.string().uuid().optional(),
    type: z.enum(['receiving', 'picking', 'cycle-count', 'transfer']),
    status: z.enum(['pending', 'in-progress', 'done']).default('pending'),
    assignee: z.string().optional(),
    dueDate: z.string().datetime(),
    notes: z.string().optional()
  });

  router.post('/', (req, res, next) => {
    try {
      const payload = baseSchema.parse(req.body);
      const created = createTask(store, payload);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  });

  const statusSchema = z.object({
    status: z.enum(['pending', 'in-progress', 'done'])
  });

  router.patch('/:id/status', (req, res, next) => {
    try {
      const payload = statusSchema.parse(req.body);
      const updated = updateTaskStatus(store, req.params.id, payload.status);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
