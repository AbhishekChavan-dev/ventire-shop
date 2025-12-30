import { useNavigate } from "react-router-dom";
//import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { Beaker, Trash2, User} from "lucide-react";
const PRICE = 2499;

export default function Cart({ cart, setCart }) {
  //const { user } = useAuth();
  const navigate = useNavigate();
  // 1. Get user from localStorage
  const [user, setUser] = useState(null);
  user = localStorage.getItem("user");
    if (!user) {
      alert("Please login to purchase");
      navigate("/LoginAuth");
      return;
    }
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  {/*} useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;*/}

  const removeItem = () => {
    setCart({ quantity: 0 });
  };
  const totalAmount = cart.quantity * PRICE;

  const updateQuantity = (qty) => {
    if (qty < 1) return;
    setCart({ quantity: qty });
  };

  const checkout = async () => {
    // 2. Security Check: Ensure user is logged in before paying
    if (!user) {
      alert("Please login to proceed with payment");
      navigate("/Login");
      return;
    }
    try {

      // 1. Call backend to create order
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({ quantity: cart.quantity,
          userId: user.id || user._id // Use whichever your DB returns
         }),
      }
      );

      const order = await res.json();
      console.log("Order received:", order);

      // 2. Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Ventire",
        description: "Ventire Air Purifier",
        order_id: order.id,
        // 4. Prefill user data in Razorpay UI for better UX
        prefill: {
          name: user.name,
          email: user.email,},
        handler: async function (response) {
          try {
            // 1. Save order in backend
            await fetch("/api/store-order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                amount: totalAmount,
                quantity: cart.quantity,
                userId: user.id || user._id, // 5. Pass userId to store-order
                status: "paid",
              }),
            });


            // 2. Navigate to success page
            navigate(`/Success?orderId=${response.razorpay_order_id}`);
          } catch (err) {
            console.error("Order save failed", err);
            navigate("/Failure");
          }
        },


        modal: {
          ondismiss: () => navigate("/failure"),
        },
        theme: { color: "#16a34a" },
      };

      // 3. Open Razorpay
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Try again.");
    }
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
        {/* REMOVE ITEM */}
        <button
          onClick={removeItem}
          className="ml-auto text-red-600 hover:text-red-800 font-semibold"
        >
          Remove
        </button>
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
