import express from 'express';
import { orderData } from '../controller/orderControle.js';
import userjwt from '../middleware/userjwt.js';

const router = express.Router();
router.post('/', userjwt, orderData);
export default router;