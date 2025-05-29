import express from 'express';
import { ROLES } from '../constants.js';
import { createASN, getASN, listASNs } from '../controllers/asn.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
const router = express.Router();

//protected routes
router.post('/', authenticate, authorize(ROLES.WAREHOUSE_OPS), createASN);
router.get('/', authenticate, listASNs);
router.get('/:asnNumber', authenticate, getASN);

export default router;