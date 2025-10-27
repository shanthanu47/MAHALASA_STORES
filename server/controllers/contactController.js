import Contact from '../models/Contact.js';
import { sendContactEmail } from '../configs/email.js';

// Submit contact form
const submitContactForm = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, subject, message } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !phone || !subject || !message) {
            return res.json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.json({ 
                success: false, 
                message: 'Please enter a valid email address' 
            });
        }

        // Phone validation (basic)
        if (phone.length < 10) {
            return res.json({ 
                success: false, 
                message: 'Please enter a valid phone number' 
            });
        }

        // Create contact entry in database
        const contactData = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            phone: phone.trim(),
            subject,
            message: message.trim()
        };

        const newContact = new Contact(contactData);
        await newContact.save();

        // Send emails
        const emailResult = await sendContactEmail(contactData);
        
        if (emailResult.success) {
            res.json({ 
                success: true, 
                message: 'Thank you for your message! We will get back to you within 24 hours.' 
            });
        } else {
            res.json({ 
                success: true, 
                message: 'Your message has been saved. We will contact you soon!' 
            });
        }

    } catch (error) {
        console.error('Contact form submission error:', error);
        res.json({ 
            success: false, 
            message: 'Something went wrong. Please try again later.' 
        });
    }
};

// Get all contact messages (for admin)
const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find()
            .sort({ createdAt: -1 })
            .limit(100);

        res.json({ 
            success: true, 
            contacts 
        });
    } catch (error) {
        console.error('Get contacts error:', error);
        res.json({ 
            success: false, 
            message: 'Failed to fetch contacts' 
        });
    }
};

// Update contact status (for admin)
const updateContactStatus = async (req, res) => {
    try {
        const { contactId } = req.params;
        const { status, adminNotes } = req.body;

        const contact = await Contact.findByIdAndUpdate(
            contactId,
            { status, adminNotes },
            { new: true }
        );

        if (!contact) {
            return res.json({ 
                success: false, 
                message: 'Contact not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Contact updated successfully',
            contact 
        });
    } catch (error) {
        console.error('Update contact error:', error);
        res.json({ 
            success: false, 
            message: 'Failed to update contact' 
        });
    }
};

export { submitContactForm, getAllContacts, updateContactStatus };
