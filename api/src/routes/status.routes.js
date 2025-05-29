import express from 'express';
import { getStatusHistory, updateStatus } from '../controllers/status.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.get('/:asnNumber/history', authenticate, getStatusHistory);
router.patch('/:asnNumber', authenticate, updateStatus);

export default router;