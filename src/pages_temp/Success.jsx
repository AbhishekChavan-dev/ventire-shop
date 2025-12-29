import { Link } from "react-router-dom";
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
