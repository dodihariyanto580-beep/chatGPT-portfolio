import { Router } from 'express';
import { DataStore } from '../core/dataStore';
import { buildDashboardSnapshot } from '../core/dashboard';

export const createDashboardRouter = (store: DataStore) => {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json(buildDashboardSnapshot(store));
  });

  return router;
};
