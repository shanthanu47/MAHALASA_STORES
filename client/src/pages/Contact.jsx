import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { assets } from '../assets/assets';

const Contact = () => {
    const [activeTab, setActiveTab] = useState('contact');
    const [expandedFAQ, setExpandedFAQ] = useState(null);
    const { axios } = useAppContext();

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.firstName || !formData.lastName || !formData.email || 
            !formData.phone || !formData.subject || !formData.message) {
            toast.error('Please fill in all fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        if (formData.phone.length < 10) {
            toast.error('Please enter a valid phone number');
            return;
        }

        setIsSubmitting(true);

        try {
            const { data } = await axios.post('/api/contact/submit', formData);
            
            if (data.success) {
                toast.success(data.message);
                // Reset form
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Contact form error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleFAQ = (index) => {
        setExpandedFAQ(expandedFAQ === index ? null : index);
    };

    const contactInfo = {
        names: ['Mahalasa Shenoy', 'Shanthanu Shenoy'],
        address: 'Mahalasa Stores, Karjat, Udupi District, Karnataka - 576112, India',
        phones: ['+91 8310781274', '+91 9379852711'],
        email: 'shanthanushenoy8511@gmail.com'
    };

    const faqs = [
        {
            question: "What are your delivery hours?",
            answer: "We deliver from 8:00 AM to 10:00 PM, 7 days a week. Our fastest delivery is within 30 minutes for orders placed during peak hours."
        },
        {
            question: "What is your minimum order value?",
            answer: "The minimum order value is ₹199. Orders below this amount will incur a delivery fee as per your pincode location."
        },
        {
            question: "How do I track my order?",
            answer: "Once your order is placed, you'll receive a confirmation SMS/email with tracking details. You can also track your order in the 'My Orders' section of your account."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit/debit cards, UPI payments, net banking, and digital wallets through our secure Razorpay gateway. All payments are processed securely."
        },
        {
            question: "What is your return/refund policy?",
            answer: "We offer a 100% money-back guarantee for quality issues. Fresh produce can be returned within 2 hours of delivery. Packaged goods can be returned within 24 hours if unopened."
        },
        {
            question: "Do you deliver to my area?",
            answer: "We deliver to most areas within the city limits. Enter your pincode during checkout to check if delivery is available in your area and to see applicable delivery charges."
        },
        {
            question: "How can I cancel my order?",
            answer: "You can cancel your order within 5 minutes of placing it. After that, please contact our support team immediately. Once the order is out for delivery, it cannot be cancelled."
        },
        {
            question: "Are your products fresh and of good quality?",
            answer: "Yes! We source directly from local farms and trusted suppliers. All fresh produce is quality-checked before delivery. We guarantee freshness and offer replacement for any quality issues."
        }
    ];

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-8">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    We're here to help! Get in touch with us for any queries, complaints, or feedback about our services.
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
                <div className="bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('contact')}
                        className={`px-6 py-2 rounded-md transition-all ${
                            activeTab === 'contact'
                                ? 'bg-primary text-white shadow-md'
                                : 'text-gray-600 hover:text-primary'
                        }`}
                    >
                        Contact Info
                    </button>
                    <button
                        onClick={() => setActiveTab('faq')}
                        className={`px-6 py-2 rounded-md transition-all ${
                            activeTab === 'faq'
                                ? 'bg-primary text-white shadow-md'
                                : 'text-gray-600 hover:text-primary'
                        }`}
                    >
                        FAQs
                    </button>
                </div>
            </div>

            {/* Contact Information Tab */}
            {activeTab === 'contact' && (
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Left Column - Contact Details */}
                        <div className="space-y-8">
                            {/* Store Owners */}
                            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <img src={assets.profile_icon} alt="owners" className="w-6 h-6 mr-3 opacity-70" />
                                    Store Owners
                                </h2>
                                <div className="space-y-3">
                                    {contactInfo.names.map((name, index) => (
                                        <div key={index} className="flex items-center">
                                            <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                                            <span className="text-gray-700 font-medium">{name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Address */}
                            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <img src={assets.delivery_truck_icon} alt="address" className="w-6 h-6 mr-3 opacity-70" />
                                    Store Address
                                </h2>
                                <p className="text-gray-700 leading-relaxed">{contactInfo.address}</p>
                            </div>

                            {/* Phone Numbers */}
                            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-6 h-6 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                    </svg>
                                    Phone Numbers
                                </h2>
                                <div className="space-y-3">
                                    {contactInfo.phones.map((phone, index) => (
                                        <div key={index} className="flex items-center">
                                            <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                                            <a href={`tel:${phone}`} className="text-gray-700 hover:text-primary transition-colors font-medium">
                                                {phone}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-6 h-6 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                    Email for Queries & Complaints
                                </h2>
                                <a href={`mailto:${contactInfo.email}`} className="text-primary hover:text-primary-dull transition-colors font-medium text-lg">
                                    {contactInfo.email}
                                </a>
                                <p className="text-gray-500 text-sm mt-2">
                                    We typically respond within 24 hours
                                </p>
                            </div>
                        </div>

                        {/* Right Column - Contact Form */}
                        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Enter your first name"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Enter your last name"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Enter your email address"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Enter your phone number"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="query">General Query</option>
                                        <option value="complaint">Complaint</option>
                                        <option value="order">Order Issue</option>
                                        <option value="delivery">Delivery Issue</option>
                                        <option value="payment">Payment Issue</option>
                                        <option value="feedback">Feedback</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                                        placeholder="Please describe your query or concern in detail..."
                                        disabled={isSubmitting}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full font-medium py-3 px-6 rounded-md transition-colors ${
                                        isSubmitting 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-primary hover:bg-primary-dull text-white'
                                    }`}
                                >
                                    {isSubmitting ? 'Sending Message...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Operating Hours */}
                    <div className="mt-12 bg-gradient-to-r from-primary/10 to-primary/20 p-8 rounded-lg">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Store Operating Hours</h2>
                            <div className="grid md:grid-cols-3 gap-6 mt-6">
                                <div className="text-center">
                                    <h3 className="font-semibold text-gray-900 mb-2">Store Timing</h3>
                                    <p className="text-gray-700">Monday - Sunday</p>
                                    <p className="text-primary font-medium">7:00 AM - 11:00 PM</p>
                                </div>
                                <div className="text-center">
                                    <h3 className="font-semibold text-gray-900 mb-2">Delivery Hours</h3>
                                    <p className="text-gray-700">Every Day</p>
                                    <p className="text-primary font-medium">8:00 AM - 10:00 PM</p>
                                </div>
                                <div className="text-center">
                                    <h3 className="font-semibold text-gray-900 mb-2">Customer Support</h3>
                                    <p className="text-gray-700">24/7</p>
                                    <p className="text-primary font-medium">Always Available</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* FAQ Tab */}
            {activeTab === 'faq' && (
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-gray-600">
                            Find quick answers to common questions about our services
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-6 py-4 text-left focus:outline-none hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-medium text-gray-900 pr-4">
                                            {faq.question}
                                        </h3>
                                        <div className={`transform transition-transform duration-200 ${
                                            expandedFAQ === index ? 'rotate-180' : ''
                                        }`}>
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </button>
                                {expandedFAQ === index && (
                                    <div className="px-6 pb-4">
                                        <div className="border-t border-gray-200 pt-4">
                                            <p className="text-gray-700 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Additional Help */}
                    <div className="mt-12 text-center bg-gray-50 p-8 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Still have questions?</h3>
                        <p className="text-gray-600 mb-6">
                            Can't find the answer you're looking for? Our customer support team is here to help.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href={`tel:${contactInfo.phones[0]}`}
                                className="bg-primary hover:bg-primary-dull text-white font-medium py-3 px-6 rounded-md transition-colors"
                            >
                                Call Us Now
                            </a>
                            <a
                                href={`mailto:${contactInfo.email}`}
                                className="border border-primary text-primary hover:bg-primary hover:text-white font-medium py-3 px-6 rounded-md transition-colors"
                            >
                                Email Us
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Contact
