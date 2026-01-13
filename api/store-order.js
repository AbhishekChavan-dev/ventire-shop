export const config = {
    runtime: "nodejs",
};
import crypto from "crypto"; // Built-in Node.js module
import connectDB from "../lib/mongodb.js";
import Order from "../models/Orders.js";
// import easyinvoice from 'easyinvoice';
import nodemailer from "nodemailer";
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';


// Helper to generate code
const generateShortId = () => `VT-${Math.floor(1000 + Math.random() * 9000)}`;

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { orderId, paymentId, signature, amount, quantity, items, status, userId, useremail, address } = req.body;
        // 1. SECURITY CHECK: Verify the Signature
        const secret = process.env.RAZORPAY_KEY_SECRET;
        const generated_signature = crypto
            .createHmac("sha256", secret)
            .update(orderId + "|" + paymentId)
            .digest("hex");

        if (generated_signature !== signature) {
            console.error("❌ Security Alert: Invalid Signature!");
            return res.status(400).json({ success: false, message: "Transaction invalid" });
        }

        await connectDB();
        // 🟢 3. Validate address exists before saving
        if (!address || !address.street || !address.phone) {
            return res.status(400).json({ success: false, message: "Shipping address is required" });
        }
        console.log("📦 Order received:", req.body);

        const customOrderId = generateShortId(); // 🟢 Generate VT-XXXX

        if (!orderId) {
            return res.status(400).json({ error: "orderId missing" });
        }

        const savedOrder = await Order.create({
            orderNumber: customOrderId, // 🟢 Save the simple number
            userId: userId.toString().includes("guest") ? null : userId, // 👈 Link the order to the user
            useremail: useremail,
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
            amount,
            quantity,
            items, // 🟢 Get the array from the frontend
            status,
            address: address, // 👈 This saves the street, city, pincode, and phone
        });
        // ... savedOrder logic ...

        // const shippingInfo = await createShippingOrder(savedOrder);

        // if (shippingInfo.order_id) {
        //     // Optional: Update your DB with Shiprocket's internal ID
        //     savedOrder.shiprocket_order_id = shippingInfo.order_id;
        //     await savedOrder.save();
        // }

        // // // 2. Send to Shipping Partner
        // // const shippingResponse = await createShippingOrder(savedOrder);
        // // // 3. Update order with tracking ID if available
        // // if (shippingResponse.shipment_id) {
        // //     savedOrder.shippingId = shippingResponse.shipment_id;
        // //     await newOrder.save();
        // // }
        // {/*} return res.status(201).json({
        //     success: true,
        //     order: savedOrder,
        // });*/}
        // // 🟢 Send the custom ID back to the frontend
        // res.status(200).json({
        //     success: true,
        //     displayId: customOrderId
        // });
        // 1. Await the shipping creation
        const shippingInfo = await createShippingOrder(savedOrder);

        // 2. Log the result so you can see it in Vercel
        console.log("Shiprocket API Result:", shippingInfo);

        if (shippingInfo && shippingInfo.order_id) {
            savedOrder.shiprocket_order_id = shippingInfo.order_id;
            await savedOrder.save();

        } else {
            // This will tell you EXACTLY why it failed in your Vercel Logs
            console.error("Shipping failed to sync:", shippingInfo);
        }
        // 3. Generate Invoice (Internal Helper)
        // You can now email this 'invoiceBase64' to the user using Nodemailer
        // Inside handler after savedOrder and shippingInfo
        const invoiceBase64 = await generateInvoice(savedOrder);
        // 2. Send the Email
        await sendInvoiceEmail(useremail, customOrderId, invoiceBase64);
        // 3. ONLY NOW send the response to the user
        return res.status(200).json({
            success: true,
            displayId: customOrderId
        });
    } catch (error) {
        console.error("❌ Store order error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
// async function generateInvoice(orderData) {
//     // 1. Create a new PDF Document
//     const pdfDoc = await PDFDocument.create();
//     const page = pdfDoc.addPage([600, 800]);
//     const { width, height } = page.getSize();

//     // 2. Load Fonts
//     const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
//     const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

//     // 3. Header
//     page.drawText('INVOICE', { x: 50, y: height - 50, size: 24, font: fontBold });
//     page.drawText(`Order ID: ${orderData.orderNumber}`, { x: 50, y: height - 80, size: 12, font: fontRegular });
//     page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: 50, y: height - 95, size: 12, font: fontRegular });

//     // 4. Billing Details
//     page.drawText('Bill To:', { x: 50, y: height - 140, size: 14, font: fontBold });
//     page.drawText(orderData.useremail || 'Customer', { x: 50, y: height - 160, size: 11, font: fontRegular });
//     page.drawText(orderData.address.street, { x: 50, y: height - 175, size: 11, font: fontRegular });
//     page.drawText(`${orderData.address.city}, ${orderData.address.pincode}`, { x: 50, y: height - 190, size: 11, font: fontRegular });

//     // 5. Product Table Header
//     page.drawRectangle({ x: 50, y: height - 250, width: 500, height: 25, color: rgb(0.95, 0.95, 0.95) });
//     page.drawText('Item Description', { x: 60, y: height - 243, size: 10, font: fontBold });
//     page.drawText('Qty', { x: 350, y: height - 243, size: 10, font: fontBold });
//     page.drawText('Price', { x: 400, y: height - 243, size: 10, font: fontBold });
//     page.drawText('Total', { x: 480, y: height - 243, size: 10, font: fontBold });

//     // 6. Draw Items
//     let currentY = height - 275;
//     orderData.items.forEach((item) => {
//         page.drawText(item.name || 'Ventire Air Purifier', { x: 60, y: currentY, size: 10, font: fontRegular });
//         page.drawText(String(item.quantity || 1), { x: 350, y: currentY, size: 10, font: fontRegular });
//         page.drawText(`Rs${item.price}`, { x: 400, y: currentY, size: 10, font: fontRegular });
//         page.drawText(`Rs${item.price * item.quantity}`, { x: 480, y: currentY, size: 10, font: fontRegular });
//         currentY -= 20;
//     });

//     // 7. Grand Total
//     page.drawRectangle({ x: 350, y: currentY - 30, width: 200, height: 1, color: rgb(0, 0, 0) });
//     page.drawText('Grand Total:', { x: 350, y: currentY - 50, size: 14, font: fontBold });
//     page.drawText(`Rs${orderData.amount}`, { x: 470, y: currentY - 50, size: 14, font: fontBold });

//     // 8. Footer
//     page.drawText('Thank you for choosing Ventire!', { x: width / 2 - 80, y: 50, size: 10, font: fontRegular, color: rgb(0.5, 0.5, 0.5) });

//     // 9. Serialize to Base64 (Useful for emailing as attachment)
//     const pdfBytes = await pdfDoc.saveAsBase64();
//     return pdfBytes;
// }
async function generateInvoice(orderData) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // --- 1. SELLER & BRANDING HEADER ---
    page.drawText('VENTIRE', { x: 50, y: height - 50, size: 24, font: fontBold, color: rgb(0, 0.4, 0.8) });
    page.drawText('TAX INVOICE', { x: 450, y: height - 50, size: 16, font: fontBold });

    const sellerY = height - 85;
    page.drawText('Sold By:', { x: 50, y: sellerY, size: 10, font: fontBold });
    page.drawText('Ventire Solutions India\n123, Clean Air Business Park\nPune, Maharashtra - 411045\nGSTIN: 27AAAAA0000A1Z5', {
        x: 50, y: sellerY - 15, size: 9, font: fontRegular, lineHeight: 12
    });

    // Order Meta Info
    page.drawText(`Invoice No: ${orderData.orderNumber}`, { x: 400, y: sellerY - 15, size: 10, font: fontRegular });
    page.drawText(`Date: ${new Date().toLocaleDateString('en-IN')}`, { x: 400, y: sellerY - 30, size: 10, font: fontRegular });

    // --- 2. BILLING & SHIPPING DETAILS ---
    const billToY = height - 180;
    page.drawText('Bill To / Ship To:', { x: 50, y: billToY, size: 10, font: fontBold });
    page.drawText(`${orderData.address.fullName || 'Valued Customer'}\n${orderData.address.addressLine}\n${orderData.address.city}, ${orderData.address.state} - ${orderData.address.pincode}\nContact: ${orderData.address.phone}`, {
        x: 50, y: billToY - 15, size: 9, font: fontRegular, lineHeight: 12
    });

    // --- 3. PRODUCT TABLE ---
    const tableHeaderY = height - 280;
    // Table Background
    page.drawRectangle({ x: 50, y: tableHeaderY, width: 500, height: 20, color: rgb(0.95, 0.95, 0.95) });

    // Header Labels
    const headers = [
        { text: 'Description', x: 60 },
        { text: 'HSN', x: 280 },
        { text: 'Qty', x: 340 },
        { text: 'Rate', x: 390 },
        { text: 'Total', x: 480 }
    ];
    headers.forEach(h => page.drawText(h.text, { x: h.x, y: tableHeaderY + 6, size: 9, font: fontBold }));

    // Draw Items
    let currentY = tableHeaderY - 20;
    orderData.items.forEach((item) => {
        page.drawText(item.name || 'Ventire Air Purifier', { x: 60, y: currentY, size: 9, font: fontRegular });
        page.drawText('8421', { x: 280, y: currentY, size: 9, font: fontRegular }); // HSN Code for Air Purifiers
        page.drawText(String(item.quantity || 1), { x: 340, y: currentY, size: 9, font: fontRegular });
        page.drawText(`Rs. ${item.price.toLocaleString('en-IN')}`, { x: 390, y: currentY, size: 9, font: fontRegular });
        page.drawText(`Rs. ${(item.price * item.quantity).toLocaleString('en-IN')}`, { x: 480, y: currentY, size: 9, font: fontRegular });
        currentY -= 20;
    });

    // --- 4. TAX CALCULATION & TOTALS ---
    const totalBoxY = currentY - 20;
    page.drawLine({ start: { x: 350, y: totalBoxY + 10 }, end: { x: 550, y: totalBoxY + 10 }, thickness: 1 });

    const totalLines = [
        { label: 'Sub-Total:', value: `Rs. ${orderData.amount}` },
        { label: 'Tax (GST 18%):', value: 'Included' },
        { label: 'Shipping:', value: 'FREE' }
    ];

    let summaryY = totalBoxY - 10;
    totalLines.forEach(line => {
        page.drawText(line.label, { x: 350, y: summaryY, size: 9, font: fontRegular });
        page.drawText(line.value, { x: 480, y: summaryY, size: 9, font: fontRegular });
        summaryY -= 15;
    });

    // Grand Total Highlight
    page.drawRectangle({ x: 345, y: summaryY - 10, width: 205, height: 25, color: rgb(0.1, 0.4, 0.8) });
    page.drawText('Grand Total:', { x: 350, y: summaryY + 2, size: 12, font: fontBold, color: rgb(1, 1, 1) });
    page.drawText(`Rs. ${Math.round(orderData.amount).toLocaleString('en-IN')}`, { x: 460, y: summaryY + 2, size: 12, font: fontBold, color: rgb(1, 1, 1) });

    // --- 5. COMPLIANCE FOOTER ---
    const footerY = 80;
    page.drawText('Terms & Conditions:', { x: 50, y: footerY, size: 8, font: fontBold });
    page.drawText('1. Goods once sold will not be taken back.\n2. Warranty is covered under manufacturer terms.\n3. This is a computer-generated invoice and requires no physical signature.', {
        x: 50, y: footerY - 12, size: 7, font: fontRegular, lineHeight: 10, color: rgb(0.4, 0.4, 0.4)
    });

    page.drawText('Thank you for choosing VENTIRE - Breathe Pure.', {
        x: width / 2 - 100, y: 30, size: 10, font: fontRegular, color: rgb(0, 0.4, 0.8)
    });

    const pdfBytes = await pdfDoc.saveAsBase64();
    return pdfBytes;
}
async function getShiprocketToken() {
    const authResponse = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: process.env.SHIPROCKET_EMAIL,
            password: process.env.SHIPROCKET_PASSWORD
        })
    });

    const authData = await authResponse.json();
    if (!authData.token) {
        throw new Error("Shiprocket Authentication Failed: " + authData.message);
    }
    return authData.token;
}
async function createShippingOrder(orderData) {
    try {
        const token = await getShiprocketToken();

        // 1. Format Date correctly (YYYY-MM-DD HH:mm)
        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0] + " " + date.toTimeString().split(' ')[0].slice(0, 5);

        const payload = {
            "order_id": String(orderData.orderNumber || Date.now()), // Must be a string
            "order_date": formattedDate,
            "pickup_location": "Primary", // 🟢 Ensure this matches your nickname in Shiprocket Settings
            "billing_customer_name": String(orderData.address.name).slice(0, 30),
            "billing_last_name": " ", // Shiprocket sometimes fails if this is empty
            "billing_address": String(orderData.address.street).slice(0, 190),
            "billing_city": String(orderData.address.city),
            "billing_pincode": parseInt(orderData.address.pincode), // Must be a number
            "billing_state": orderData.address.state || "Maharashtra",
            "billing_country": "India",
            "billing_email": orderData.useremail || "test@test.com",
            "billing_phone": String(orderData.address.phone).replace(/\D/g, '').slice(-10), // Clean phone number
            // 🟢 ADD THESE TWO LINES BELOW
            "shipping_is_billing": true,
            "breadth": 30, // You had 'width', but Shiprocket specifically wants 'breadth'
            "order_items": orderData.items.map(item => ({
                "name": (item.name || "Ventire Air Purifier").slice(0, 30),
                "sku": (item.sku || "VNT-001"),
                "units": parseInt(item.quantity) || 1,
                "selling_price": parseInt(item.price)
            })),
            "payment_method": "Prepaid",
            "sub_total": parseInt(orderData.amount),
            "length": 30, "width": 30, "height": 50, "weight": 4.5
        };

        const response = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        // 🔴 CRITICAL: This will show in your Vercel logs if it fails
        if (!result.order_id) {
            console.error("SHIPROCKET REJECTION:", JSON.stringify(result));
        }

        return result;
    } catch (error) {
        console.error("SHIPROCKET_API_CRASH:", error);
        return { error: error.message };
    }
}
async function sendInvoiceEmail(userEmail, orderNumber, invoiceBase64) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, // Your gmail: ventire@gmail.com
            pass: process.env.EMAIL_PASS  // The 16-character App Password
        }
    });

    const mailOptions = {
        from: `"Ventire" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `Your Ventire Invoice - Order #${orderNumber}`,
        text: `Thank you for your purchase! Please find your invoice attached for Order #${orderNumber}.`,
        attachments: [
            {
                filename: `Invoice_${orderNumber}.pdf`,
                content: invoiceBase64,
                encoding: 'base64'
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("📧 Invoice email sent successfully to:", userEmail);
    } catch (error) {
        console.error("❌ Email failed to send:", error);
    }
}