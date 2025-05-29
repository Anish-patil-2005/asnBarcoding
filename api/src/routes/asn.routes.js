import express from 'express';
import { ROLES } from '../constants.js';
import { createASN, fulfillASN, getASN, listASNs } from '../controllers/asn.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
const router = express.Router();

//protected routes
router.post('/', authenticate, authorize(ROLES.WAREHOUSE_OPS), createASN);
router.get('/', authenticate, listASNs);
router.get('/:asnNumber', authenticate, getASN);
router.post('/:asnNumber/fulfill', authenticate, authorize(ROLES.VENDOR), fulfillASN);

export default router;