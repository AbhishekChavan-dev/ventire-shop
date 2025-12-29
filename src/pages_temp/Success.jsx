import { useSearchParams, Link } from "react-router-dom";

export default function Success() {
  const [params] = useSearchParams();

  const orderId = params.get("orderId");
  const paymentId = params.get("paymentId");

  return (
    <div className="pt-32 text-center max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Payment Successful 🎉
      </h1>

      <div className="bg-white p-6 rounded-xl shadow mt-6 text-left">
        <p className="mb-2">
          <strong>Order ID:</strong>
          <br />
          <span className="text-sm text-gray-600 break-all">{orderId}</span>
        </p>

        <p>
          <strong>Payment ID:</strong>
          <br />
          <span className="text-sm text-gray-600 break-all">{paymentId}</span>
        </p>
      </div>

      <Link
        to="/"
        className="inline-block mt-8 bg-green-600 text-white px-6 py-3 rounded-lg"
      >
        Back to Home
      </Link>
    </div>
  );
}
