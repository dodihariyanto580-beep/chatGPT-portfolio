import { Item, Order, Shipment, StockLevel, Task, Warehouse } from './types';

export interface DataStore {
  warehouses: Warehouse[];
  items: Item[];
  stockLevels: StockLevel[];
  shipments: Shipment[];
  orders: Order[];
  tasks: Task[];
}

export const createDataStore = (seed?: Partial<DataStore>): DataStore => ({
  warehouses: seed?.warehouses ?? [],
  items: seed?.items ?? [],
  stockLevels: seed?.stockLevels ?? [],
  shipments: seed?.shipments ?? [],
  orders: seed?.orders ?? [],
  tasks: seed?.tasks ?? []
});

export const cloneStore = (store: DataStore): DataStore => ({
  warehouses: [...store.warehouses],
  items: [...store.items],
  stockLevels: [...store.stockLevels],
  shipments: [...store.shipments],
  orders: [...store.orders],
  tasks: [...store.tasks]
});
