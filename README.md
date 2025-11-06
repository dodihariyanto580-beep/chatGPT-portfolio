# Logistics ERP Core API

An open-source ERP starter focused on logistics operations (warehousing, inventory, inbound/outbound shipments). The project exposes a REST API built with TypeScript and Express to help supply-chain teams digitize critical flows such as replenishment, bonded-zone receiving, and outbound fulfillment.

## Features

- 📦 **Warehouse & Inventory** – track stock levels, safety stock and reorder points per warehouse, log manual adjustments.
- 🚚 **Shipments** – manage inbound/outbound shipments with hazard notes, carriers, and due-date tracking.
- 📑 **Orders** – create purchase, transfer, and sales orders linked to warehouses and shipment execution.
- 🧑‍🤝‍🧑 **Tasks** – assign receiving, picking, cycle count tasks and follow their progress.
- 📊 **Dashboard** – utilization per warehouse, pending & late shipments, low-stock alerts, and open execution tasks.
- 🧱 **Seed data** – SEZ-focused logistics dataset for immediate experimentation.

## Getting started

```bash
npm install
npm run dev
```

The API defaults to `http://localhost:4000`. Use the `/` root endpoint to confirm the server is running and `/api/*` routes for ERP resources.

### Example requests

```bash
# List logistics dashboard metrics
curl http://localhost:4000/api/dashboard

# Create a new inbound shipment
curl -X POST http://localhost:4000/api/shipments \
  -H "Content-Type: application/json" \
  -d '{
        "reference": "INB-TEST-001",
        "type": "inbound",
        "origin": "Port Klang, MY",
        "destination": "Jakarta Free Trade Zone DC",
        "scheduledDate": "2024-05-01T00:00:00.000Z",
        "warehouseId": "<warehouse-id>",
        "lines": [{ "itemId": "<item-id>", "quantity": 50, "uom": "pcs" }]
      }'
```

Replace `<warehouse-id>` and `<item-id>` with identifiers from `/api/warehouses` and `/api/inventory` responses.

## Project structure

```
src/
  config/         Seed data and future configuration
  core/           Shared domain types and dashboard builder
  modules/        Business logic for inventory, shipments, orders, tasks, warehouses
  routes/         Express routers wrapping module capabilities
  server.ts       Application bootstrap
```

## Roadmap ideas

- Persistent storage via PostgreSQL or MongoDB adapters
- Role-based access control & audit trails
- Advanced planning (slotting, wave picking, transport routing)
- Integration connectors (INSW, Ceisa, ASYCUDA, SAP)

## License

MIT — feel free to adapt for your logistics operations.
