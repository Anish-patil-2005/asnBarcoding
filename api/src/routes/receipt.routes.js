import express from 'express';
import { ROLES } from '../constants.js';
import { receiveASN } from '../controllers/receipt.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/:asnNumber/receive', authenticate, authorize(ROLES.GATEKEEPER), receiveASN);

export default router;