import { STATUSES } from '../constants.js';
import ShipmentStatusLog from '../models/shipmentstatuslog.model.js';

export const updateStatus = async (req, res, next) => {
  try {
    const { asnNumber } = req.params;
    const { status, remarks } = req.body;

    if (!STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const log = await ShipmentStatusLog.create({ asnNumber, status, changedBy: req.user._id, remarks });
    
    res.json(log);
  } catch (err) {
    next(err);
  }
};

export const getStatusHistory = async (req, res, next) => {
  try {
    const history = await ShipmentStatusLog.find({ asnNumber: req.params.asnNumber });
    
    res.json(history);
  } catch (err) {
    next(err);
  }
};