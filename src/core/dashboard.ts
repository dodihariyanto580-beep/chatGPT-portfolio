import { DataStore } from './dataStore';
import { DashboardSnapshot, StockLevel } from './types';
import { isPastDue } from '../utils/date';

const calculateUtilization = (store: DataStore, stock: StockLevel) => {
  const warehouse = store.warehouses.find((w) => w.id === stock.warehouseId);
  const item = store.items.find((i) => i.id === stock.itemId);
  if (!warehouse || !item) return 0;

  const occupiedCbm = item.cubicMeterPerUnit * stock.quantity;
  return Math.min(1, occupiedCbm / warehouse.capacityCbm);
};

export const buildDashboardSnapshot = (store: DataStore): DashboardSnapshot => {
  const warehouseUtilization = store.warehouses.map((warehouse) => {
    const stocks = store.stockLevels.filter((stock) => stock.warehouseId === warehouse.id);
    const utilization = stocks.reduce((acc, stock) => acc + calculateUtilization(store, stock), 0);
    return {
      warehouseId: warehouse.id,
      warehouseName: warehouse.name,
      utilization: Number(utilization.toFixed(2))
    };
  });

  const pendingShipments = store.shipments.filter((shipment) => shipment.status === 'planned');
  const lateShipments = store.shipments.filter(
    (shipment) => shipment.status !== 'completed' && isPastDue(shipment.scheduledDate)
  );

  const lowStock = store.stockLevels
    .filter((stock) => stock.quantity <= stock.reorderPoint)
    .map((stock) => {
      const item = store.items.find((i) => i.id === stock.itemId);
      const warehouse = store.warehouses.find((w) => w.id === stock.warehouseId);
      if (!item || !warehouse) {
        throw new Error('Invalid stock entry for dashboard');
      }
      return { ...stock, item, warehouse };
    });

  const openTasks = store.tasks.filter((task) => task.status !== 'done');

  return {
    generatedAt: new Date().toISOString(),
    warehouseUtilization,
    pendingShipments,
    lateShipments,
    lowStock,
    openTasks
  };
};
