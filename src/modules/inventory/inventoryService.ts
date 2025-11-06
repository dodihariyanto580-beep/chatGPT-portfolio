import { randomUUID } from 'node:crypto';
import { isAfter, isBefore } from '../../utils/date';
import { DataStore } from '../../core/dataStore';
import { Item, StockLevel, Warehouse } from '../../core/types';

export interface InventorySummaryRow {
  warehouse: Warehouse;
  item: Item;
  quantity: number;
  reorderPoint: number;
  safetyStock: number;
  coverageDays: number;
  status: 'healthy' | 'watch' | 'critical';
}

export interface AdjustmentInput {
  warehouseId: string;
  itemId: string;
  quantity: number;
  reason: 'cycle-count' | 'damage' | 'transfer' | 'manual';
  note?: string;
}

export interface AdjustmentRecord {
  id: string;
  warehouseId: string;
  itemId: string;
  quantity: number;
  reason: AdjustmentInput['reason'];
  note?: string;
  createdAt: string;
}

const adjustmentLog: AdjustmentRecord[] = [];

export const listInventorySummary = (store: DataStore): InventorySummaryRow[] => {
  return store.stockLevels.map((stock) => {
    const warehouse = store.warehouses.find((w) => w.id === stock.warehouseId);
    const item = store.items.find((i) => i.id === stock.itemId);
    if (!warehouse || !item) {
      throw new Error('Invalid stock entry');
    }

    const coverageDays = Math.round(stock.quantity / (item.defaultLeadTimeDays / 2));
    let status: InventorySummaryRow['status'] = 'healthy';
    if (stock.quantity <= stock.safetyStock) {
      status = 'critical';
    } else if (stock.quantity <= stock.reorderPoint) {
      status = 'watch';
    }

    return {
      warehouse,
      item,
      quantity: stock.quantity,
      reorderPoint: stock.reorderPoint,
      safetyStock: stock.safetyStock,
      coverageDays,
      status
    } satisfies InventorySummaryRow;
  });
};

export const recordAdjustment = (store: DataStore, payload: AdjustmentInput): AdjustmentRecord => {
  const stock = store.stockLevels.find(
    (entry) => entry.warehouseId === payload.warehouseId && entry.itemId === payload.itemId
  );

  if (!stock) {
    const newStock: StockLevel = {
      id: randomUUID(),
      warehouseId: payload.warehouseId,
      itemId: payload.itemId,
      quantity: payload.quantity,
      safetyStock: 0,
      reorderPoint: 0,
      lastCountedAt: new Date().toISOString()
    };
    store.stockLevels.push(newStock);
  } else {
    stock.quantity += payload.quantity;
    stock.lastCountedAt = new Date().toISOString();
  }

  const record: AdjustmentRecord = {
    id: randomUUID(),
    warehouseId: payload.warehouseId,
    itemId: payload.itemId,
    quantity: payload.quantity,
    reason: payload.reason,
    note: payload.note,
    createdAt: new Date().toISOString()
  };

  adjustmentLog.push(record);
  return record;
};

export const listAdjustments = (options?: { warehouseId?: string; itemId?: string; from?: string; to?: string }) => {
  return adjustmentLog.filter((entry) => {
    if (options?.warehouseId && entry.warehouseId !== options.warehouseId) return false;
    if (options?.itemId && entry.itemId !== options.itemId) return false;
    if (options?.from && isBefore(entry.createdAt, options.from)) return false;
    if (options?.to && isAfter(entry.createdAt, options.to)) return false;
    return true;
  });
};
