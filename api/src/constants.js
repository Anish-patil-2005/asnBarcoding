export const ROLES = {
  VENDOR: 'vendor',
  WAREHOUSE_OPS: 'warehouse_ops',
  GATEKEEPER: 'gatekeeper',
};

export const STATUSES = [
      'requested', // Created by Warehouse Ops
      'acknowledged', // Vendor confirms receiving the request
      'partially_fulfilled', // Vendor provides partial quantity
      'fulfilled', // Vendor marks as fully prepared for shipment
      'in_transit', // Shipment is on its way
      'arrived', // Gatekeeper scans barcode at entry
      'under_verification', // Gatekeeper compares actual vs. expected
      'verified', // Warehouse Ops confirms after gatekeeper check
      'reconciled', // Discrepancies resolved, ready for financial processing
      'completed', // Final delivery and record closure
      'cancelled' // Order withdrawn or aborted
];