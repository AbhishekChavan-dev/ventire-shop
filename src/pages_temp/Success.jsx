{/*import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

export default function Success() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");
  return (
    <div className="pt-32 text-center">
      <h1 className="text-3xl font-bold text-green-600">
        Payment Successful 🎉
      </h1>
      <p className="mt-4 text-lg">
        Order ID: <strong>{orderId}</strong>
      </p>
      <Link to="/" className="mt-6 block text-green-600 underline">
        Back to Home
      </Link>
    </div>
  );
}
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, ShoppingBag } from "lucide-react";

const Success = () => {
  const [searchParams] = useSearchParams();
  const orderNo = searchParams.get("orderNo"); // 🟢 Get the VT-XXXX 

  return (
    <div className="pt-32 pb-20 flex flex-col items-center justify-center px-4">
      <CheckCircle size={80} className="text-green-500 mb-6" />
      <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">Payment Successful!</h1>
      <p className="text-gray-500 mb-8 text-center text-lg">
        Thank you for your purchase. Your order is being processed.
      </p>

      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 w-full max-w-md text-center mb-8">
        <p className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-1">Order Number</p>
        <p className="text-3xl font-mono font-bold text-green-600">{orderNo || "Loading..."}</p>
      </div>

      <div className="flex gap-4">
        <Link to="/myorders" className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-all">
          View My Orders
        </Link>
        <Link to="/" className="border border-gray-200 px-8 py-3 rounded-full font-bold hover:bg-gray-50 transition-all">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};
export default Success;*/}
import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle, MapPin, Package, Truck } from "lucide-react";

const Success = () => {
  const [searchParams] = useSearchParams();
  const orderNo = searchParams.get("orderNo");
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // We fetch by orderNumber (VT-XXXX)
        const res = await fetch(`/api/get-order-details?orderNo=${orderNo}`);
        const data = await res.json();
        if (data.success) {
          setOrderDetails(data.order);
        }
      } catch (err) {
        console.error("Failed to load order info", err);
      } finally {
        setLoading(false);
      }
    };

    if (orderNo) fetchOrder();
  }, [orderNo]);

  return (
    <div className="pt-32 pb-20 flex flex-col items-center justify-center px-4">
      <div className="bg-green-100 p-4 rounded-full mb-6">
        <CheckCircle size={60} className="text-green-600" />
      </div>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">Order Confirmed!</h1>
      <p className="text-gray-500 mb-8 text-center text-lg">
        Your air purifier is on its way to making your air cleaner.
      </p>

      {/* Order Number Badge */}
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 w-full max-w-md text-center mb-6">
        <p className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-1">Order Number</p>
        <p className="text-3xl font-mono font-bold text-green-600">{orderNo || "..."}</p>
      </div>

      {/* 🟢 NEW: Shipping Address Card */}
      {!loading && orderDetails?.address && (
        <div className="w-full max-w-md bg-white border border-green-100 rounded-2xl p-5 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-50">
            <Truck size={18} className="text-green-600" />
            <h3 className="font-bold text-gray-800">Shipping Details</h3>
          </div>
          
          <div className="flex gap-3">
            <MapPin size={20} className="text-gray-400 mt-1 shrink-0" />
            <div className="text-sm text-gray-600 italic">
              <p className="font-semibold text-gray-900 not-italic">
                {orderDetails.address.street}
              </p>
              <p>{orderDetails.address.city}, {orderDetails.address.pincode}</p>
              <p className="mt-2 text-gray-500 font-medium not-italic">
                Contact: {orderDetails.address.phone}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link to="/myorders" className="flex-1 text-center bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all">
          View My Orders
        </Link>
        <Link to="/" className="flex-1 text-center border border-gray-200 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all text-gray-700">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Success;
