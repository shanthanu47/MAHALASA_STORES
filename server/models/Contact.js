import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        enum: ['query', 'complaint', 'order', 'delivery', 'payment', 'feedback', 'other']
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'resolved', 'in-progress'],
        default: 'pending'
    },
    adminNotes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
