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
}*/}
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
export default Success;
