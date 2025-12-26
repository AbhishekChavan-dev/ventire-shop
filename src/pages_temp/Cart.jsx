import { useNavigate } from "react-router-dom";

const PRICE = 2499;

export default function Cart({ cart, setCart }) {
  const navigate = useNavigate();

  const totalAmount = cart.quantity * PRICE;

  const updateQuantity = (qty) => {
    if (qty < 1) return;
    setCart({ quantity: qty });
  };

  const checkout = async () => {
    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: cart.quantity }),
    });

    const order = await res.json();

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Ventire",
      description: "Ventire Air Purifier",
      order_id: order.id,
      handler: function (response) {
        navigate(`/success?pid=${response.razorpay_payment_id}`);
      },
      modal: {
        ondismiss: () => navigate("/failure"),
      },
      theme: { color: "#16a34a" },
    };

    new window.Razorpay(options).open();
  };

  if (cart.quantity === 0) {
    return (
      <div className="pt-32 text-center">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
      </div>
    );
  }

  return (
    <div className="pt-32 max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between mb-4">
          <span>Ventire Air Purifier</span>
          <span>₹{totalAmount}</span>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => updateQuantity(cart.quantity - 1)}>-</button>
          <span>{cart.quantity}</span>
          <button onClick={() => updateQuantity(cart.quantity + 1)}>+</button>
        </div>

        <button
          onClick={checkout}
          className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg"
        >
          Pay ₹{totalAmount}
        </button>
      </div>
    </div>
  );
}
