import bwipjs from 'bwip-js';

// Generate a Code128 barcode PNG buffer for a given ASN number

export const generateBarcode = async (asnNumber) => {
  return bwipjs.toBuffer({
    bcid:        'code128',
    text:        asnNumber,
    scale:       3,
    height:      10,
    includetext: true,
    textxalign:  'center',
  });
};