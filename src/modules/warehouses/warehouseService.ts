import { randomUUID } from 'node:crypto';
import { DataStore } from '../../core/dataStore';
import { Warehouse } from '../../core/types';

export const listWarehouses = (store: DataStore): Warehouse[] => store.warehouses;

export const createWarehouse = (
  store: DataStore,
  payload: Omit<Warehouse, 'id'>
): Warehouse => {
  const warehouse: Warehouse = { id: randomUUID(), ...payload };
  store.warehouses.push(warehouse);
  return warehouse;
};

export const updateWarehouse = (
  store: DataStore,
  warehouseId: string,
  payload: Partial<Omit<Warehouse, 'id'>>
): Warehouse => {
  const warehouse = store.warehouses.find((w) => w.id === warehouseId);
  if (!warehouse) {
    throw new Error('Warehouse not found');
  }
  Object.assign(warehouse, payload);
  return warehouse;
};
