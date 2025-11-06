import { Router } from 'express';
import { DataStore } from '../core/dataStore';
import { createInventoryRouter } from './inventoryRoutes';
import { createShipmentRouter } from './shipmentRoutes';
import { createWarehouseRouter } from './warehouseRoutes';
import { createOrderRouter } from './orderRoutes';
import { createTaskRouter } from './taskRoutes';
import { createDashboardRouter } from './dashboardRoutes';

export const registerRoutes = (store: DataStore) => {
  const router = Router();

  router.use('/dashboard', createDashboardRouter(store));
  router.use('/warehouses', createWarehouseRouter(store));
  router.use('/inventory', createInventoryRouter(store));
  router.use('/shipments', createShipmentRouter(store));
  router.use('/orders', createOrderRouter(store));
  router.use('/tasks', createTaskRouter(store));

  return router;
};
