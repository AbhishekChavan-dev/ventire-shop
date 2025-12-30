import React, { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, MapPin, Truck, ShoppingBag, Calendar } from 'lucide-react';

const MyOrders = ({ user }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            try {
                const userId = user._id;
                const res = await fetch(`/api/get-orders?userId=${userId}`);
                const data = await res.json();
                setOrders(data);
            } catch (err) {
                console.error("Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    if (loading) return <div className="pt-32 text-center">Loading your orders...</div>;

    return (
        <div className="pt-32 pb-20 max-w-4xl mx-auto px-4">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <Package className="text-green-600" /> My Orders
            </h1>

            {orders.length === 0 ? (
                <div className="bg-gray-50 p-10 rounded-2xl text-center border-2 border-dashed">
                    <p className="text-gray-500">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Order ID</p>
                                    <p className="text-sm font-mono text-gray-600">{order.orderNumber}</p>
                                </div>
                                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                                    <CheckCircle size={12} /> {order.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="flex justify-between items-center border-t pt-4">
                                <div className="text-sm text-gray-600">
                                    <span className="font-bold text-gray-900">₹{order.amount}</span> — {order.quantity} Unit(s)
                                </div>

                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                    <Clock size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            {/* 🟢 Displaying the saved address */}
                            {order.address && (
                                <div className="mt-4 pt-4 border-t border-dashed flex gap-3 items-start">
                                    <MapPin size={16} className="text-gray-400 mt-1" />
                                    <div className="text-sm text-gray-600">
                                        <p className="font-semibold text-gray-800">Delivery Address:</p>
                                        <p>{order.address.street}, {order.address.city} - {order.address.pincode}</p>
                                        <p className="mt-1 text-xs">Contact: {order.address.phone}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;