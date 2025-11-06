import { randomUUID } from 'node:crypto';
import { DataStore } from '../core/dataStore';
import { Item, Order, OrderStatus, OrderType, Shipment, ShipmentStatus, ShipmentType, StockLevel, Task, Warehouse } from '../core/types';

const createWarehouse = (partial: Omit<Warehouse, 'id'>): Warehouse => ({
  id: randomUUID(),
  ...partial
});

const createItem = (partial: Omit<Item, 'id'>): Item => ({
  id: randomUUID(),
  ...partial
});

const createStock = (partial: Omit<StockLevel, 'id'>): StockLevel => ({
  id: randomUUID(),
  ...partial
});

const createShipment = (partial: Omit<Shipment, 'id'>): Shipment => ({
  id: randomUUID(),
  ...partial
});

const createOrder = (partial: Omit<Order, 'id' | 'createdAt'> & { createdAt?: string }): Order => ({
  id: randomUUID(),
  createdAt: partial.createdAt ?? new Date().toISOString(),
  ...partial
});

const createTask = (partial: Omit<Task, 'id'>): Task => ({
  id: randomUUID(),
  ...partial
});

export const buildSeedData = (): DataStore => {
  const warehouses: Warehouse[] = [
    createWarehouse({
      code: 'JKT-FTZ',
      name: 'Jakarta Free Trade Zone DC',
      location: 'Jakarta, Indonesia',
      capacityCbm: 12000,
      temperatureControlled: false,
      remarks: 'Bonded logistics centre'
    }),
    createWarehouse({
      code: 'KDL-SEZ',
      name: 'Kendal SEZ Distribution Hub',
      location: 'Kendal, Central Java',
      capacityCbm: 6500,
      temperatureControlled: true,
      remarks: 'Handles lithium battery storage'
    })
  ];

  const items: Item[] = [
    createItem({
      sku: 'BAT-LFP-001',
      description: 'Lithium Iron Phosphate Battery Pack',
      unitOfMeasure: 'pcs',
      hazardous: true,
      defaultLeadTimeDays: 21,
      cubicMeterPerUnit: 0.08
    }),
    createItem({
      sku: 'INV-CTRL-900',
      description: 'Inverter Controller Unit',
      unitOfMeasure: 'pcs',
      hazardous: false,
      defaultLeadTimeDays: 14,
      cubicMeterPerUnit: 0.05
    }),
    createItem({
      sku: 'SPN-TRAY-12',
      description: 'Battery Shipping Tray - 12 slot',
      unitOfMeasure: 'pcs',
      hazardous: false,
      defaultLeadTimeDays: 7,
      cubicMeterPerUnit: 0.01
    })
  ];

  const [jakarta, kendal] = warehouses;

  const stockLevels: StockLevel[] = [
    createStock({
      warehouseId: jakarta.id,
      itemId: items[0].id,
      quantity: 320,
      safetyStock: 120,
      reorderPoint: 200,
      lastCountedAt: new Date().toISOString()
    }),
    createStock({
      warehouseId: jakarta.id,
      itemId: items[1].id,
      quantity: 540,
      safetyStock: 200,
      reorderPoint: 300,
      lastCountedAt: new Date().toISOString()
    }),
    createStock({
      warehouseId: kendal.id,
      itemId: items[0].id,
      quantity: 110,
      safetyStock: 90,
      reorderPoint: 150,
      lastCountedAt: new Date().toISOString()
    }),
    createStock({
      warehouseId: kendal.id,
      itemId: items[2].id,
      quantity: 800,
      safetyStock: 250,
      reorderPoint: 400,
      lastCountedAt: new Date().toISOString()
    })
  ];

  const shipments: Shipment[] = [
    createShipment({
      reference: 'INB-2404-1001',
      type: 'inbound' satisfies ShipmentType,
      status: 'planned' satisfies ShipmentStatus,
      origin: 'Shanghai, CN',
      destination: 'Jakarta Free Trade Zone DC',
      scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      warehouseId: jakarta.id,
      lines: [
        { id: randomUUID(), itemId: items[0].id, quantity: 150, uom: 'pcs' },
        { id: randomUUID(), itemId: items[2].id, quantity: 200, uom: 'pcs' }
      ],
      notes: 'Requires DG declaration for lithium batteries'
    }),
    createShipment({
      reference: 'OUT-2404-0032',
      type: 'outbound',
      status: 'in-progress',
      origin: 'Kendal SEZ Distribution Hub',
      destination: 'Surabaya Customer Hub',
      scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      warehouseId: kendal.id,
      lines: [
        { id: randomUUID(), itemId: items[1].id, quantity: 120, uom: 'pcs' }
      ],
      carrier: 'JNE Logistics',
      notes: 'Include MSDS with documents'
    })
  ];

  const orders: Order[] = [
    createOrder({
      orderNumber: 'PO-2404-778',
      type: 'purchase' satisfies OrderType,
      status: 'approved' satisfies OrderStatus,
      supplierOrCustomer: 'Shenzhen Battery Corp',
      expectedDate: shipments[0].scheduledDate,
      warehouseId: jakarta.id,
      lines: [
        { id: randomUUID(), itemId: items[0].id, quantity: 150, unitPrice: 420 },
        { id: randomUUID(), itemId: items[2].id, quantity: 200, unitPrice: 18 }
      ]
    }),
    createOrder({
      orderNumber: 'SO-2404-112',
      type: 'sales',
      status: 'receiving' satisfies OrderStatus,
      supplierOrCustomer: 'Java Energi Nusantara',
      expectedDate: shipments[1].scheduledDate,
      warehouseId: kendal.id,
      lines: [
        { id: randomUUID(), itemId: items[1].id, quantity: 120, unitPrice: 860 }
      ]
    })
  ];

  const tasks: Task[] = [
    createTask({
      warehouseId: jakarta.id,
      shipmentId: shipments[0].id,
      type: 'receiving',
      status: 'pending',
      assignee: 'Aulia',
      dueDate: shipments[0].scheduledDate,
      notes: 'Coordinate customs inspection slot'
    }),
    createTask({
      warehouseId: kendal.id,
      shipmentId: shipments[1].id,
      orderId: orders[1].id,
      type: 'picking',
      status: 'in-progress',
      assignee: 'Bima',
      dueDate: new Date().toISOString(),
      notes: 'Verify DG packaging compliance'
    }),
    createTask({
      warehouseId: kendal.id,
      type: 'cycle-count',
      status: 'pending',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Battery tray location audit'
    })
  ];

  return {
    warehouses,
    items,
    stockLevels,
    shipments,
    orders,
    tasks
  } satisfies DataStore;
};
