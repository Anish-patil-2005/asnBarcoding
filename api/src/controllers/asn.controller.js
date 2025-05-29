import { STATUSES } from '../constants.js';
import ASN from '../models/ASN.model.js';
import ShipmentStatusLog from '../models/shipmentstatuslog.model.js';
import { generateBarcode } from '../utils/generateBarcode.js';

export const createASN = async (req, res, next) => {
  try {
    const { orderId, lineItems, ...header } = req.body;
    const asnNumber = `ASN${Date.now()}`;
    const newAsn = await ASN.create({ asnNumber, orderId, ...header, lineItems });
    await ShipmentStatusLog.create({ asnNumber, status: STATUSES[0], changedBy: req.user._id });
    const png = await generateBarcode(asnNumber);
    
    res
    .status(201)
    .json({ 
      asnNumber, 
      barcode: png.toString('base64') 
    });
  } catch (err) {
    next(err);
  }
};

export const listASNs = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.status) filter.status = req.query.status;
    const asns = await ASN.find(filter);
    
    res.json(asns);
  } catch (err) {
    next(err);
  }
};
// export const fullfillASN = async (req, res, next) => {
//   try {
//     const filter = {};

//     if (req.query.status) filter.status = req.query.status;
//     const asns = await ASN.find(filter);
    
//     res.json(asns);
//   } catch (err) {
//     next(err);
//   }
// };

export const getASN = async (req, res, next) => {
  try {
    const asn = await ASN.findOne({ asnNumber: req.params.asnNumber });
    
    if (!asn) return res.status(404).json({ message: 'ASN not found' });
    
    res.json(asn);
  } catch (err) {
    next(err);
  }
};
