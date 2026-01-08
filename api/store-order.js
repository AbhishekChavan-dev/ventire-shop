export const config = {
    runtime: "nodejs",
};
import crypto from "crypto"; // Built-in Node.js module
import connectDB from "../lib/mongodb.js";
import Order from "../models/Orders.js";
import easyinvoice from 'easyinvoice';

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

        const shippingInfo = await createShippingOrder(savedOrder);

        if (shippingInfo.order_id) {
            // Optional: Update your DB with Shiprocket's internal ID
            savedOrder.shiprocket_order_id = shippingInfo.order_id;
            await savedOrder.save();
        }
        // 3. Generate Invoice (Internal Helper)
        // You can now email this 'invoiceBase64' to the user using Nodemailer
        // const invoiceBase64 = await generateInvoice(savedOrder);
        // // 2. Send to Shipping Partner
        // const shippingResponse = await createShippingOrder(savedOrder);
        // // 3. Update order with tracking ID if available
        // if (shippingResponse.shipment_id) {
        //     savedOrder.shippingId = shippingResponse.shipment_id;
        //     await newOrder.save();
        // }
        {/*} return res.status(201).json({
            success: true,
            order: savedOrder,
        });*/}
        // 🟢 Send the custom ID back to the frontend
        res.status(200).json({
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
// // Fixed generateInvoice Helper
// async function generateInvoice(orderData) {
//     const data = {
//         "images": { "logo": "https://ventire-shop.vercel.app/Ventire-logo.png" },
//         "sender": { "company": "Ventire", "address": "Business Park, Andheri", "city": "Mumbai", "country": "India" },
//         "client": {
//             "company": orderData.useremail, // Using email as name if name field is missing
//             "address": orderData.address.street,
//             "zip": orderData.address.pincode,
//             "city": orderData.address.city
//         },
//         "information": { "number": orderData.orderNumber, "date": new Date().toLocaleDateString() },
//         "products": orderData.items.map(item => ({
//             "quantity": item.quantity || 1,
//             "description": item.name || "Ventire Air Purifier",
//             "tax-rate": 18,
//             "price": item.price
//         })),
//         "bottom-notice": "Thank you for breathing pure with Ventire!",
//         "settings": { "currency": "INR" }
//     };

//     const result = await easyinvoice.createInvoice(data);
//     return result.pdf;
// }
// async function createShippingOrder(orderData) {
//     const shiprocketToken = process.env.SHIPROCKET_TOKEN;

//     const payload = {
//         "order_id": orderData.displayId,
//         "order_date": new Date().toISOString(),
//         "pickup_location": "Primary",
//         "billing_customer_name": orderData.address.name || "Customer",
//         "billing_last_name": "",
//         "billing_address": orderData.address.street,
//         "billing_city": orderData.address.city,
//         "billing_pincode": orderData.address.pincode,
//         "billing_state": "Maharashtra",
//         "billing_country": "India",
//         "billing_email": orderData.useremail,
//         "billing_phone": orderData.address.phone,
//         "order_items": orderData.items.map(item => ({
//             "name": "Ventire Air Purifier",
//             "sku": "VNT-001",
//             "units": item.quantity,
//             "selling_price": item.price
//         })),
//         "payment_method": "Prepaid",
//         "sub_total": orderData.amount,
//         "length": 30, "width": 30, "height": 50, "weight": 4.5
//     };

//     const response = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"}
//             "Authorization": `Bearer ${shiprocketToken}`
//         },
//         body: JSON.stringify(payload)
// body: JSON.stringify({
//             email: process.env.SHIPROCKET_EMAIL,
//             password: process.env.SHIPROCKET_PASSWORD
//         })
//     });

//     return await response.json();
// }/
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
        // First, get the dynamic token
        const token = await getShiprocketToken();

        const payload = {
            "order_id": orderData.orderNumber, // Using your VT-XXXX ID
            "order_date": new Date().toISOString(),
            "pickup_location": "Primary", // Ensure this name exists in Shiprocket Panel
            "billing_customer_name": orderData.address.name || "Customer",
            "billing_last_name": "",
            "billing_address": orderData.address.street,
            "billing_city": orderData.address.city,
            "billing_pincode": orderData.address.pincode,
            "billing_state": orderData.address.state || "Maharashtra",
            "billing_country": "India",
            "billing_email": orderData.useremail,
            "billing_phone": orderData.address.phone,
            "order_items": orderData.items.map(item => ({
                "name": item.name || "Ventire Air Purifier",
                "sku": item.sku || "VNT-001",
                "units": item.quantity,
                "selling_price": item.price
            })),
            "payment_method": "Prepaid",
            "sub_total": orderData.amount,
            "length": 30, "width": 30, "height": 50, "weight": 4.5
        };

        const response = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Use the token here
            },
            body: JSON.stringify(payload)
        });

        return await response.json();
    } catch (error) {
        console.error("Shiprocket API Error:", error);
        return { success: false, message: error.message };
    }
}