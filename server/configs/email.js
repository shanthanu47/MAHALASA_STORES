import nodemailer from 'nodemailer';

// Email configuration
const createTransporter = () => {
    // For Gmail, you'll need to use App Password instead of regular password
    // Go to Google Account Settings > Security > 2-Step Verification > App Passwords
    return nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Your Gmail address
            pass: process.env.EMAIL_PASS  // Your Gmail App Password
        }
    });
};

export const sendContactEmail = async (contactData) => {
    const transporter = createTransporter();

    // Email to admin
    const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: 'shanthanushenoy8511@gmail.com',
        subject: `New Contact Form Submission - ${contactData.subject}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #4ade80; color: white; padding: 20px; text-align: center;">
                    <h1>New Contact Form Submission</h1>
                    <p>Mahalasa Stores Website</p>
                </div>
                
                <div style="padding: 20px; background-color: #f9fafb;">
                    <h2 style="color: #374151; margin-bottom: 20px;">Contact Details:</h2>
                    
                    <div style="background-color: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #4ade80;">
                        <p><strong>Name:</strong> ${contactData.firstName} ${contactData.lastName}</p>
                        <p><strong>Email:</strong> ${contactData.email}</p>
                        <p><strong>Phone:</strong> ${contactData.phone}</p>
                        <p><strong>Subject:</strong> ${contactData.subject}</p>
                    </div>
                    
                    <div style="background-color: white; padding: 15px; border-radius: 8px; border-left: 4px solid #4ade80;">
                        <p><strong>Message:</strong></p>
                        <p style="background-color: #f3f4f6; padding: 10px; border-radius: 4px; white-space: pre-wrap;">${contactData.message}</p>
                    </div>
                    
                    <div style="margin-top: 20px; padding: 10px; background-color: #e5e7eb; border-radius: 4px; font-size: 12px; color: #6b7280;">
                        <p>Submitted on: ${new Date().toLocaleString()}</p>
                    </div>
                </div>
                
                <div style="background-color: #374151; color: white; padding: 15px; text-align: center; font-size: 12px;">
                    <p>This email was generated automatically from the Mahalasa Stores contact form.</p>
                </div>
            </div>
        `
    };

    // Confirmation email to customer
    const customerMailOptions = {
        from: process.env.EMAIL_USER,
        to: contactData.email,
        subject: 'Thank you for contacting Mahalasa Stores',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #4ade80; color: white; padding: 20px; text-align: center;">
                    <h1>Thank You for Contacting Us!</h1>
                    <p>Mahalasa Stores</p>
                </div>
                
                <div style="padding: 20px; background-color: #f9fafb;">
                    <h2 style="color: #374151;">Dear ${contactData.firstName},</h2>
                    
                    <p style="color: #4b5563; line-height: 1.6;">
                        Thank you for reaching out to us. We have received your message and our team will review it carefully. 
                        We typically respond to all inquiries within 24 hours.
                    </p>
                    
                    <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4ade80;">
                        <h3 style="color: #374151; margin-top: 0;">Your Message Details:</h3>
                        <p><strong>Subject:</strong> ${contactData.subject}</p>
                        <p><strong>Message:</strong></p>
                        <p style="background-color: #f3f4f6; padding: 10px; border-radius: 4px; white-space: pre-wrap;">${contactData.message}</p>
                    </div>
                    
                    <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                        <h3 style="color: #1e40af; margin-top: 0;">Need Immediate Assistance?</h3>
                        <p style="color: #1e40af; margin: 5px 0;"><strong>Call us:</strong> +91 8310781274</p>
                        <p style="color: #1e40af; margin: 5px 0;"><strong>WhatsApp:</strong> +91 9379852711</p>
                        <p style="color: #1e40af; margin: 5px 0;"><strong>Store Hours:</strong> 7:00 AM - 11:00 PM (Daily)</p>
                    </div>
                </div>
                
                <div style="background-color: #374151; color: white; padding: 15px; text-align: center;">
                    <p style="margin: 0;">Best Regards,<br>The Mahalasa Stores Team</p>
                    <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.8;">
                        This is an automated confirmation email.
                    </p>
                </div>
            </div>
        `
    };

    try {
        // Send both emails
        await Promise.all([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(customerMailOptions)
        ]);
        return { success: true, message: 'Emails sent successfully' };
    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, message: 'Failed to send email', error: error.message };
    }
};
