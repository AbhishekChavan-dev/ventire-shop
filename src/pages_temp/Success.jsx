import { Link } from "react-router-dom";

export default function Success() {
  return (
    <div className="pt-32 text-center">
      <h1 className="text-3xl font-bold text-green-600">
        Payment Successful 🎉
      </h1>
      <Link to="/" className="mt-6 block text-green-600 underline">
        Back to Home
      </Link>
    </div>
  );
}
