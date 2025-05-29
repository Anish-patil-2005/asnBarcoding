import { STATUSES } from '../constants.js';
import ASN from '../models/ASN.model.js';
import ASNreceipt from '../models/ASNreceipt.model.js';
import ShipmentStatusLog from '../models/shipmentstatuslog.model.js';

export const receiveASN = async (req, res, next) => {
  try {
    const { asnNumber } = req.params;
    const { lineItemsReceived } = req.body;
    const asn = await ASN.findOne({ asnNumber });
    
    if (!asn) return res.status(404).json({ message: 'ASN not found' });
    const discrepancies = lineItemsReceived.filter(
      item => item.expected !== item.received
    );

    const isVerified = discrepancies.length === 0;

    const receipt = await ASNreceipt.create({
      asnNumber,
      scannedBy: req.user._id,
      lineItemsReceived,
      discrepancies,
      isVerified,
    });

    const newStatus = isVerified ? STATUSES[7] : STATUSES[6];
    asn.status = newStatus;
    await asn.save();
    await ShipmentStatusLog.create({ asnNumber, status: newStatus, changedBy: req.user._id });
    
    res.json(receipt);
  } catch (err) {
    next(err);
  }
};