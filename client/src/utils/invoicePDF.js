import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateInvoicePDF = (orderData, userInfo, razorpayId) => {
    try {
        console.log("Starting PDF generation with data:", { orderData, userInfo, razorpayId });
        
        const doc = new jsPDF();
        
        // Store Information
        const storeInfo = {
            name: "Mahalasa Stores",
            address: "Karjat, Udupi District, Karnataka - 576112, India",
            phones: ["+91 8310781274", "+91 9379852711"],
            email: "shanthanushenoy8511@gmail.com",
            owners: ["Mahalasa Shenoy", "Shanthanu Shenoy"]
        };

        // Validate required data
        if (!orderData || !orderData._id) {
            throw new Error("Invalid order data: missing order ID");
        }
        
        if (!orderData.items || orderData.items.length === 0) {
            throw new Error("Invalid order data: no items found");
        }

        // Colors
        const primaryColor = [74, 222, 128]; // Green color
        const darkColor = [31, 41, 55];
        const lightGray = [156, 163, 175];

        // Header Section
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
        
        // Store Name and Logo area
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont(undefined, 'bold');
        doc.text("MAHALASA STORES", 20, 25);
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text("Your Trusted Local Grocery Partner", 20, 32);
        
        // Invoice Title
        doc.setTextColor(...darkColor);
        doc.setFontSize(20);
        doc.setFont(undefined, 'bold');
        doc.text("INVOICE", 150, 25);
        
        // Invoice Details Box
        doc.setFillColor(248, 250, 252);
        doc.rect(140, 45, 65, 35, 'F');
        doc.setDrawColor(...lightGray);
        doc.rect(140, 45, 65, 35, 'S');
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(...darkColor);
        doc.text("Invoice #:", 145, 55);
        doc.text("Date:", 145, 62);
        doc.text("Payment ID:", 145, 69);
        doc.text("Status:", 145, 76);
        
        doc.setFont(undefined, 'normal');
        doc.text(orderData._id.slice(-8).toUpperCase(), 170, 55);
        doc.text(new Date(orderData.date).toLocaleDateString(), 170, 62);
        doc.text(razorpayId ? razorpayId.slice(-10) : "N/A", 170, 69);
        doc.text("PAID", 170, 76);
        
        // Store Information Section
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(...darkColor);
        doc.text("From:", 20, 95);
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text(storeInfo.name, 20, 105);
        
        doc.setFont(undefined, 'normal');
        doc.text(storeInfo.address, 20, 112);
        doc.text(`Phone: ${storeInfo.phones[0]}`, 20, 119);
        doc.text(`WhatsApp: ${storeInfo.phones[1]}`, 20, 126);
        doc.text(`Email: ${storeInfo.email}`, 20, 133);
        
        // Customer Information Section
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(...darkColor);
        doc.text("Bill To:", 20, 150);
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text(userInfo?.name || "Customer", 20, 160);
        
        doc.setFont(undefined, 'normal');
        if (orderData.address) {
            const address = orderData.address;
            doc.text(`${address.street || ''}`, 20, 167);
            doc.text(`${address.city || ''}, ${address.state || ''}`, 20, 174);
            doc.text(`PIN: ${address.zipcode || ''}`, 20, 181);
            doc.text(`Phone: ${address.phone || ''}`, 20, 188);
        }
        
        // Items Table using simple text layout (more reliable than autoTable)
        const tableStartY = 205;
        
        // Table Headers
        doc.setFillColor(...primaryColor);
        doc.rect(20, tableStartY, 170, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text("Item", 25, tableStartY + 7);
        doc.text("Qty", 120, tableStartY + 7);
        doc.text("Price", 140, tableStartY + 7);
        doc.text("Total", 165, tableStartY + 7);
        
        // Table Data
        let currentY = tableStartY + 15;
        doc.setTextColor(...darkColor);
        doc.setFont(undefined, 'normal');
        
        orderData.items.forEach((item, index) => {
            // Alternate row background
            if (index % 2 === 0) {
                doc.setFillColor(248, 250, 252);
                doc.rect(20, currentY - 5, 170, 10, 'F');
            }
            
            doc.text(item.name || 'Unknown Item', 25, currentY);
            doc.text(`${item.quantity || 1}`, 120, currentY);
            doc.text(`Rs.${item.price || 0}`, 140, currentY);
            doc.text(`Rs.${(item.quantity || 1) * (item.price || 0)}`, 165, currentY);
            
            currentY += 12;
        });
        
        // Totals Section
        const totalsY = currentY + 10;
        
        // Calculate totals properly
        // Calculate subtotal from actual items (without delivery fee)
        const subtotal = orderData.items.reduce((sum, item) => {
            return sum + ((item.price || 0) * (item.quantity || 1));
        }, 0);
        
        // The delivery fee should be the difference between total order amount and item costs
        const total = orderData.amount || 0;
        const deliveryFee = Math.max(0, total - subtotal); // Delivery fee is the difference
        
        console.log("Amount calculation:", {
            itemsSubtotal: subtotal,
            orderTotalAmount: orderData.amount,
            calculatedDeliveryFee: deliveryFee,
            finalTotal: total,
            originalDeliveryFeeFromOrder: orderData.deliveryFee
        });
        
        // Totals Box
        doc.setFillColor(248, 250, 252);
        doc.rect(130, totalsY, 75, 30, 'F');
        doc.setDrawColor(...lightGray);
        doc.rect(130, totalsY, 75, 30, 'S');
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(...darkColor);
        
        doc.text("Subtotal:", 135, totalsY + 8);
        doc.text(`Rs.${subtotal}`, 185, totalsY + 8);
        
        doc.text("Delivery Fee:", 135, totalsY + 15);
        doc.text(`Rs.${deliveryFee}`, 185, totalsY + 15);
        
        // Total line
        doc.setFont(undefined, 'bold');
        doc.setFontSize(12);
        doc.text("Total:", 135, totalsY + 25);
        doc.text(`Rs.${total}`, 185, totalsY + 25);
        
        // Payment Information
        const paymentY = totalsY + 40;
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(...primaryColor);
        doc.text("Payment Information:", 20, paymentY);
        
        doc.setFont(undefined, 'normal');
        doc.setTextColor(...darkColor);
        doc.text(`Payment Method: Online Payment (Razorpay)`, 20, paymentY + 8);
        doc.text(`Transaction ID: ${razorpayId || 'N/A'}`, 20, paymentY + 15);
        doc.text(`Payment Status: Successful`, 20, paymentY + 22);
        
        // Footer
        const footerY = paymentY + 40;
        doc.setFillColor(...primaryColor);
        doc.rect(0, footerY, doc.internal.pageSize.width, 25, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text("Thank you for shopping with Mahalasa Stores!", 20, footerY + 10);
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(8);
        doc.text("Store Hours: 7:00 AM - 11:00 PM | Delivery Hours: 8:00 AM - 10:00 PM", 20, footerY + 18);
        
        // Generate filename with order ID and date
        const fileName = `MahalasaStores_Invoice_${orderData._id.slice(-8)}_${new Date().toISOString().split('T')[0]}.pdf`;
        
        // Download the PDF
        doc.save(fileName);
        
        console.log("PDF generated successfully:", fileName);
        return fileName;
        
    } catch (error) {
        console.error("PDF generation failed:", error);
        throw new Error(`Failed to generate PDF: ${error.message}`);
    }
};