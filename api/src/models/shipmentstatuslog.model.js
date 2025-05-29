import mongoose from 'mongoose';
import { STATUSES } from '../constants.js';

const shipmentStatusLogSchema = new mongoose.Schema({
  asnNumber: { 
    type: String, 
    required: true 
    
  },
  status: {
    type: String,
    enum: STATUSES,
    required: true
  },
  changedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
    
  },
  changedAt: { 
    type: Date, 
    default: Date.now 
    
  },
  remarks: String
});

export default mongoose.model('ShipmentStatusLog', shipmentStatusLogSchema);
