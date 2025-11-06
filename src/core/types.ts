export type UUID = string;

export interface Warehouse {
  id: UUID;
  code: string;
  name: string;
  location: string;
  capacityCbm: number;
  temperatureControlled: boolean;
  remarks?: string;
}

export interface Item {
  id: UUID;
  sku: string;
  description: string;
  unitOfMeasure: string;
  hazardous: boolean;
  defaultLeadTimeDays: number;
  cubicMeterPerUnit: number;
}

export interface StockLevel {
  id: UUID;
  warehouseId: UUID;
  itemId: UUID;
  quantity: number;
  safetyStock: number;
  reorderPoint: number;
  lastCountedAt: string;
}

export type ShipmentType = 'inbound' | 'outbound';
export type ShipmentStatus = 'planned' | 'in-progress' | 'completed' | 'cancelled';

export interface ShipmentLine {
  id: UUID;
  itemId: UUID;
  quantity: number;
  uom: string;
}

export interface Shipment {
  id: UUID;
  reference: string;
  type: ShipmentType;
  status: ShipmentStatus;
  origin: string;
  destination: string;
  scheduledDate: string;
  actualDate?: string;
  carrier?: string;
  notes?: string;
  warehouseId: UUID;
  lines: ShipmentLine[];
}

export type OrderType = 'purchase' | 'transfer' | 'sales';
export type OrderStatus = 'draft' | 'approved' | 'receiving' | 'fulfilled' | 'closed';

export interface OrderLine {
  id: UUID;
  itemId: UUID;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: UUID;
  orderNumber: string;
  type: OrderType;
  status: OrderStatus;
  supplierOrCustomer: string;
  expectedDate: string;
  warehouseId: UUID;
  lines: OrderLine[];
  createdAt: string;
}

export interface Task {
  id: UUID;
  warehouseId: UUID;
  shipmentId?: UUID;
  orderId?: UUID;
  type: 'receiving' | 'picking' | 'cycle-count' | 'transfer';
  status: 'pending' | 'in-progress' | 'done';
  assignee?: string;
  dueDate: string;
  notes?: string;
}

export interface DashboardSnapshot {
  generatedAt: string;
  warehouseUtilization: Array<{
    warehouseId: UUID;
    warehouseName: string;
    utilization: number;
  }>;
  pendingShipments: Shipment[];
  lateShipments: Shipment[];
  lowStock: Array<StockLevel & { item: Item; warehouse: Warehouse }>;
  openTasks: Task[];
}
