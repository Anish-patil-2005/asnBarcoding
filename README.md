
# ASN Barcoding System — API (Backend)

> **Role:** Backend Developer (Project Intern @ Fluid Controls)

---

## Project Overview

This repository contains the **API (backend)** for an ASN (Advanced Shipping Notice) Barcoding System built for Fluid Controls. The API is a RESTful service managing the lifecycle of ASNs: creation, fulfillment, receipt, verification, and status tracking. It generates Code128 barcode PNGs and incorporates role-based access control for Vendors, Warehouse Ops, and Gatekeepers.

---

## Tech Stack

- **Node.js** + **Express** for building the REST API
- **MongoDB** using **Mongoose** for data persistence
- Authentication via **JWT** and **bcryptjs** for hashing
- Barcode generation through **bwip-js**
- Other utilities: dotenv, cors

---

## My Contributions

- Designed Mongoose schemas: ASN, ASNReceipt, ShipmentStatusLog, and User
- Developed controllers for ASN lifecycle: create, fulfill, receive, status updates, and history
- Implemented JWT-based authentication and role-based authorization
- Recorded all status changes via ShipmentStatusLog for auditability
- Integrated barcode generation (Code128) using `bwip-js` and served it as base64 PNG
- Centralized database connection, error handling, and routing setup

---

## Architecture & Flow

1. **Warehouse Ops** creates an ASN (`POST /api/v1/asn`) → stored in MongoDB; initial status logged; returns ASN number and barcode.
2. **Vendor** fulfills ASN (`POST /api/v1/asn/:asnNumber/fulfill`) → updates shipped quantities; status set to `in_transit`; log updated.
3. **Gatekeeper** receives ASN (`POST /api/v1/asn/:asnNumber/receive`) → compares expected vs received; records discrepancies; sets status to `verified` or `under_verification`, logs the change.
4. Universal access: retrieve ASN, view status history, and submit manual status updates (`PATCH /api/v1/asn/status/:asnNumber`).

---

## Data Models

### ASN

- Fields include `asnNumber`, `orderId`, sender/receiver GLNs, dates, units, carrier SCAC
- `status` (enum) from a defined set in `constants.js`
- Embedded `lineItems` array with detailed shipping info

### ASNReceipt

- Tracks `asnNumber`, gatekeeper info, scanned timestamp, discrepancies, and verification status

### ShipmentStatusLog

- Logs changes with `asnNumber`, `status`, `changedBy`, timestamp, and optional remarks

### User

- Stores `username`, `passwordHash`, `role` (vendor / warehouse_ops / gatekeeper), and `email`

---

## Constants

- **ROLES**: `vendor`, `warehouse_ops`, `gatekeeper`
- **STATUSES**:
```

\[requested, acknowledged, partially\_fulfilled, fulfilled, in\_transit, arrived, under\_verification, verified, reconciled, completed, cancelled]

````

---

## API Endpoints (Summary)

> Base path: `/api/v1`

**Authentication**
- `POST /users/register`: create a new user with role and hashed password
- `POST /users/login`: returns a JWT token and user role

**ASN Lifecycle**
- `POST /asn/`: create an ASN (warehouse_ops only); returns barcode
- `GET /asn`: list ASNs with optional status filter
- `GET /asn/:asnNumber`: retrieve specific ASN
- `POST /asn/:asnNumber/fulfill`: vendor fulfills ASN; updates and logs status
- `POST /asn/:asnNumber/receive`: gatekeeper receives ASN; logs receipt and discrepancies
- `GET /asn/status/:asnNumber/history`: retrieve status change logs
- `PATCH /asn/status/:asnNumber`: manual status update with remarks

---

## Barcode Integration

- Uses `bwip-js` for generating Code128 barcodes as PNG buffers
- `createASN` returns ASN barcode in base64-encoded format for label usage

---

## Setup & Running Locally

1. Clone the repo and navigate to the `api` folder
2. Run `npm install` to install dependencies
3. Create a `.env` file:
 ```env
 MONGO_URI=mongodb://localhost:27017/asn_barcoding
 JWT_SECRET=your_jwt_secret
 PORT=5000
````

4. Start the server:

   ```bash
   npm run dev
   ```

---

## Example Curl Commands

```bash
# Register
curl -X POST http://localhost:5000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"warehouse1","password":"secret","role":"warehouse_ops","email":"w@fc.com"}'

# Login
curl -X POST http://localhost:5000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"warehouse1","password":"secret"}'

# Create ASN
curl -X POST http://localhost:5000/api/v1/asn \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d '{
    "orderId": "ORD-1234",
    "senderGLN": "12345678",
    "receiverGLN": "87654321",
    "lineItems": [
      {"lineNumber":1,"gtin":"00012345600012","description":"Valve","quantityOrdered":10,"uom":"EA"}
    ]
  }'

# Fulfill ASN
curl -X POST http://localhost:5000/api/v1/asn/ASN.../fulfill \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VENDOR_JWT" \
  -d '{"lineItems":[{"gtin":"00012345600012","quantityShipped":10}]}'

# Receive ASN
curl -X POST http://localhost:5000/api/v1/asn/ASN.../receive \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer GATEKEEPER_JWT" \
  -d '{"lineItemsReceived":[{"gtin":"00012345600012","expected":10,"received":10}]}'

# Get Status History
curl -H "Authorization: Bearer YOUR_JWT" \
  http://localhost:5000/api/v1/asn/status/ASN.../history
```

---

## Future Enhancements

* Adopt UUIDs or DB-backed sequences for `asnNumber` generation
* Add input validation (e.g., with `Joi` or `express-validator`)
* Implement unit and integration tests (e.g., Jest + Supertest)
* Dockerize and integrate with CI/CD for automated deployments
* Optimize for scale: barcode generation via worker queue, index commonly queried fields, enable pagination

---

## Key Files

* `controllers/` — core logic for ASN, receipt, status, and user management
* `models/` — Mongoose schemas (`ASN`, `ASNReceipt`, `ShipmentStatusLog`, `User`)
* `routes/` — endpoint definitions and auth guards
* `utils/generateBarcode.js` — barcode generation functionality
* `constants.js` — centralized ROLES and STATUSES
* `database/connection.js` — MongoDB connection handler
* `middlewares/` — includes `auth.middleware.js` and error handlers

---
