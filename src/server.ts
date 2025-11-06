import express from 'express';
import cors from 'cors';
import { buildSeedData } from './config/seedData';
import { createDataStore } from './core/dataStore';
import { registerRoutes } from './routes';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const seed = buildSeedData();
const store = createDataStore(seed);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    name: 'Logistics ERP API',
    version: '0.1.0',
    description: 'Open-source ERP core services for logistics operations',
    endpoints: ['/api/dashboard', '/api/warehouses', '/api/inventory', '/api/shipments', '/api/orders', '/api/tasks']
  });
});

app.use('/api', registerRoutes(store));

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err.status ?? 400;
  res.status(status).json({
    error: err.message ?? 'Unknown error',
    issues: err.issues ?? undefined
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Logistics ERP API listening on port ${PORT}`);
});
