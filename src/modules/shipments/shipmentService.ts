import { randomUUID } from 'node:crypto';
import { DataStore } from '../../core/dataStore';
import { Shipment, ShipmentStatus, ShipmentType } from '../../core/types';
import { isPastDue } from '../../utils/date';

export interface ShipmentFilters {
  warehouseId?: string;
  status?: ShipmentStatus;
  type?: ShipmentType;
}

export const listShipments = (store: DataStore, filters: ShipmentFilters = {}): Shipment[] => {
  return store.shipments.filter((shipment) => {
    if (filters.warehouseId && shipment.warehouseId !== filters.warehouseId) return false;
    if (filters.status && shipment.status !== filters.status) return false;
    if (filters.type && shipment.type !== filters.type) return false;
    return true;
  });
};

export interface ShipmentInput extends Omit<Shipment, 'id' | 'status'> {
  status?: ShipmentStatus;
}

export const createShipment = (store: DataStore, payload: ShipmentInput): Shipment => {
  const shipment: Shipment = {
    ...payload,
    id: randomUUID(),
    status: payload.status ?? 'planned'
  };
  store.shipments.push(shipment);
  return shipment;
};

export const updateShipmentStatus = (
  store: DataStore,
  shipmentId: string,
  status: ShipmentStatus,
  updates?: Partial<Pick<Shipment, 'actualDate' | 'carrier' | 'notes'>>
): Shipment => {
  const shipment = store.shipments.find((s) => s.id === shipmentId);
  if (!shipment) {
    throw new Error('Shipment not found');
  }
  shipment.status = status;
  if (updates?.actualDate) shipment.actualDate = updates.actualDate;
  if (updates?.carrier) shipment.carrier = updates.carrier;
  if (updates?.notes) shipment.notes = updates.notes;
  return shipment;
};

export const findLateShipments = (store: DataStore): Shipment[] => {
  return store.shipments.filter((shipment) => shipment.status !== 'completed' && isPastDue(shipment.scheduledDate));
};
