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
async function generateInvoice(orderData) {
    // 1. Create a new PDF Document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();

    // 2. Load Fonts
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // 3. Header
    page.drawText('INVOICE', { x: 50, y: height - 50, size: 24, font: fontBold });
    page.drawText(`Order ID: ${orderData.orderNumber}`, { x: 50, y: height - 80, size: 12, font: fontRegular });
    page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: 50, y: height - 95, size: 12, font: fontRegular });

    // 4. Billing Details
    page.drawText('Bill To:', { x: 50, y: height - 140, size: 14, font: fontBold });
    page.drawText(orderData.useremail || 'Customer', { x: 50, y: height - 160, size: 11, font: fontRegular });
    page.drawText(orderData.address.street, { x: 50, y: height - 175, size: 11, font: fontRegular });
    page.drawText(`${orderData.address.city}, ${orderData.address.pincode}`, { x: 50, y: height - 190, size: 11, font: fontRegular });

    // 5. Product Table Header
    page.drawRectangle({ x: 50, y: height - 250, width: 500, height: 25, color: rgb(0.95, 0.95, 0.95) });
    page.drawText('Item Description', { x: 60, y: height - 243, size: 10, font: fontBold });
    page.drawText('Qty', { x: 350, y: height - 243, size: 10, font: fontBold });
    page.drawText('Price', { x: 400, y: height - 243, size: 10, font: fontBold });
    page.drawText('Total', { x: 480, y: height - 243, size: 10, font: fontBold });

    // 6. Draw Items
    let currentY = height - 275;
    orderData.items.forEach((item) => {
        page.drawText(item.name || 'Ventire Air Purifier', { x: 60, y: currentY, size: 10, font: fontRegular });
        page.drawText(String(item.quantity || 1), { x: 350, y: currentY, size: 10, font: fontRegular });
        page.drawText(`₹${item.price}`, { x: 400, y: currentY, size: 10, font: fontRegular });
        page.drawText(`₹${item.price * item.quantity}`, { x: 480, y: currentY, size: 10, font: fontRegular });
        currentY -= 20;
    });

    // 7. Grand Total
    page.drawRectangle({ x: 350, y: currentY - 30, width: 200, height: 1, color: rgb(0, 0, 0) });
    page.drawText('Grand Total:', { x: 350, y: currentY - 50, size: 14, font: fontBold });
    page.drawText(`₹${orderData.amount}`, { x: 470, y: currentY - 50, size: 14, font: fontBold });

    // 8. Footer
    page.drawText('Thank you for choosing Ventire!', { x: width / 2 - 80, y: 50, size: 10, font: fontRegular, color: rgb(0.5, 0.5, 0.5) });

    // 9. Serialize to Base64 (Useful for emailing as attachment)
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