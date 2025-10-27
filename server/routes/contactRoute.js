import express from 'express';
import { submitContactForm, getAllContacts, updateContactStatus } from '../controllers/contactController.js';
import authUser from '../middlewares/authUser.js';
import authSeller from '../middlewares/authSeller.js';

const contactRoute = express.Router();

// Public route for contact form submission
contactRoute.post('/submit', submitContactForm);

// Admin routes (protected)
contactRoute.get('/all', authSeller, getAllContacts);
contactRoute.put('/update/:contactId', authSeller, updateContactStatus);

export default contactRoute;
