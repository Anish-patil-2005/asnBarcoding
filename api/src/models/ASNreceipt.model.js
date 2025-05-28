import mongoose from 'mongoose';

const receiptSchema = new mongoose.Schema({
  asnNumber: { type: String, required: true },
  scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Gatekeeper
  scannedAt: { type: Date, default: Date.now },
  discrepancies: [
    {
      gtin: String,
      expected: Number,
      received: Number
    }
  ],
  isVerified: { type: Boolean, default: false }
});

export default mongoose.model('ASNReceipt', receiptSchema);
