import express from 'express';
import authUser from '../middlewares/authUser.js';
import { saveAddress, getAddress } from '../controllers/addressController.js';

const addressRouter = express.Router();

addressRouter.post('/save', authUser, saveAddress);
addressRouter.get('/get', authUser, getAddress);

export default addressRouter;