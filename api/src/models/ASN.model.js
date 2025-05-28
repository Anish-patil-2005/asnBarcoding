import mongoose from 'mongoose';

const lineItemSchema = new mongoose.Schema({
  lineNumber: { type: Number, required: true },
  gtin: { type: String, required: true },
  description: String,
  quantityOrdered: { type: Number, required: true },
  quantityShipped: { type: Number, default: 0 },
  uom: { type: String, required: true }
});

const asnSchema = new mongoose.Schema({
  asnNumber: { type: String, required: true, unique: true },
  orderId: { type: String, required: true }, // Can be reused for template-based copies
  senderGLN: String,
  receiverGLN: String,
  shipmentDate: Date,
  estimatedDeliveryDate: Date,
  totalUnits: Number,
  carrierSCAC: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['requested', 'in_transit', 'received', 'verified'], 
    default: 'requested' 
  },
  lineItems: [lineItemSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ASN', asnSchema);
