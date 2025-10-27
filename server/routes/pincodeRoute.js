import express from 'express';
import authUser from '../middlewares/authUser.js';
import { importPincodes, getDeliveryCost } from '../controllers/pincodeController.js';

const pincodeRouter = express.Router();

// Import pincode data from Excel (Admin/Seller only - no auth required for simplicity)
pincodeRouter.post('/import', importPincodes);

// Get delivery cost for a pincode
pincodeRouter.get('/delivery-cost/:pincode', authUser, getDeliveryCost);

export default pincodeRouter;