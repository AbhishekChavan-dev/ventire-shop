// import { useNavigate } from "react-router-dom";
// //import { useAuth } from "../context/AuthContext";
// import { useEffect, useState } from "react";
// import AddressForm from "../components/AddressForm";
// import { Beaker, Trash2, User, ShieldCheck } from "lucide-react";
// const PRICE = 2499;

// export default function Cart({ cart, setCart }) {
//   //const { user } = useAuth();
//   const navigate = useNavigate();
//   // 1. Get user from localStorage
//   const [user, setUser] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   // 🟢 1. Address State
//   const [address, setAddress] = useState({
//     street: '',
//     city: '',
//     pincode: '',
//     phone: ''
//   });
//   // const currentUser = localStorage.getItem("user");
//   // if (!currentUser) {
//   //   alert("Please login to purchase");
//   //   navigate("/login");
//   //   return;
//   // }
//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (!savedUser) {
//       // alert("Please login to purchase");
//       // navigate("/login");
//     } else {
//       setUser(JSON.parse(savedUser));
//     }
//   }, [navigate]); // navigate is a stable dependency
//   {/*} useEffect(() => {
//     if (!user) {
//       navigate("/login");
//     }
//   }, [user, navigate]);

//   if (!user) return null;*/}

//   const removeItem = () => {
//     setCart({ quantity: 0 });
//   };
//   const totalAmount = cart.quantity * PRICE;

//   const updateQuantity = (qty) => {
//     if (qty < 1) return;
//     setCart({ quantity: qty });
//   };

//   const checkout = async () => {
//     // 🟢 2. Validation: Ensure address is filled
//     if (!address.street || !address.pincode || !address.phone) {
//       alert("Please fill in your delivery address and phone number.");
//       return;
//     }
//     // 2. Security Check: Ensure user is logged in before paying
//     if (!user) {
//       alert("Please login to proceed with payment");
//       navigate("/Login");
//       return;
//     }
//     // 1. Validate Address
//     if (!address.street || !address.pincode || !address.phone) {
//       return alert("Please fill in all shipping details!");
//     }
//     try {

//       // 1. Call backend to create order
//       const resCreate = await fetch("/api/create-order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json", },
//         body: JSON.stringify({
//           quantity: cart.quantity,
//           userId: user.id || user._id // Use whichever your DB returns
//         }),
//       }
//       );

//       const order = await resCreate.json();
//       console.log("Order received:", order);

//       // 2. Razorpay options
//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: order.amount,
//         currency: "INR",
//         name: "Ventire",
//         description: "Ventire Air Purifier",
//         order_id: order.id,
//         // 4. Prefill user data in Razorpay UI for better UX
//         prefill: {
//           name: user.name,
//           email: user.email,
//         },
//         handler: async function (response) {
//           // 2. TRIGGER LOADING WHEN PAYMENT IS SUCCESSFUL
//           setIsProcessing(true);
//           try {
//             // 1. Save order in backend
//             const res = await fetch("/api/store-order", {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 orderId: response.razorpay_order_id,
//                 paymentId: response.razorpay_payment_id,
//                 signature: response.razorpay_signature,
//                 amount: totalAmount,
//                 quantity: cart.quantity,
//                 userId: user._id, // 5. Pass userId to store-order
//                 useremail:user.email,
//                 address: address, // 🟢 3. Send address to backend
//                 status: "paid",
//               }),
//             });

//             const data = await res.json();
//             if (data.success && data.displayId) {
//               // 🟢 SUCCESS: Clear the cart state here
//               setCart({ quantity: 0 });
//               // ✅ SUCCESS: Redirect using the custom VT-XXXX ID
//               // 2. Navigate to success page
//               navigate(`/Success?orderNo=${data.displayId}`, {state: { address: address }});
//             } else {
//               // ⚠️ FALLBACK: If API failed but payment worked, use Razorpay ID so they aren't stuck
//               navigate(`/Success?orderNo=${response.razorpay_order_id}`);
//             }
//           } catch (err) {
//             console.error("Order save failed", err);
//             navigate("/Failure");
//           }
//         },


//         modal: {
//           ondismiss: () => navigate("/failure"),
//         },
//         theme: { color: "#16a34a" },
//       };

//       // 3. Open Razorpay
//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       console.error("Payment error:", err);
//       alert("Payment failed. Try again.");
//     }
//   };

//   if (cart.quantity === 0) {
//     return (
//       <div className="pt-32 text-center">
//         <h2 className="text-2xl font-bold">Your cart is empty</h2>
//       </div>
//     );
//   }

//   return (
//     <div className="pt-32 max-w-4xl mx-auto px-4">
//       <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

//       <div className="bg-white p-6 rounded-xl shadow">
//         <div className="flex justify-between mb-4">
//           <span>Ventire Air Purifier</span>
//           <span>₹{totalAmount}</span>
//         </div>

//         <div className="flex items-center gap-4">
//           <button onClick={() => updateQuantity(cart.quantity - 1)}>-</button>
//           <span>{cart.quantity}</span>
//           <button onClick={() => updateQuantity(cart.quantity + 1)}>+</button>
//         </div>
//         {/* REMOVE ITEM */}
//         <button
//           onClick={removeItem}
//           className="ml-auto text-red-600 hover:text-red-800 font-semibold"
//         >
//           Remove
//         </button>
//         {/* 🟢 4. The Address Form */}
//         <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
//            <AddressForm address={address} setAddress={setAddress} />
//         </div>
//         <button
//           onClick={checkout}
//           className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg"
//         >
//           Proceed to Pay ₹{totalAmount}
//         </button>
//       </div>
//       {/* 3. THE LOADING OVERLAY UI */}
//       {isProcessing && (
//         <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md">
//           <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
//           <h2 className="text-2xl font-bold text-gray-900">Processing Your Order...</h2>
//           <p className="text-gray-500 mt-2 text-center px-4">
//             We are securing your transaction. <br />
//             Please do not close this window.
//           </p>
//           <div className="mt-8 flex items-center text-gray-400 text-sm">
//             <ShieldCheck size={18} className="mr-2 text-green-500" />
//             Secure Payment Confirmed
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import AddressForm from "../components/AddressForm";
// import { Trash2, ShieldCheck, Minus, Plus } from "lucide-react";

// export default function Cart({ cart, setCart }) {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [address, setAddress] = useState({
//     street: '',
//     city: '',
//     pincode: '',
//     phone: ''
//   });

//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//   }, [navigate]);

//   // --- NEW ARRAY-BASED CALCULATIONS ---
//   // Calculates total price for all items in the array
//   const totalAmount = Array.isArray(cart)
//     ? cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
//     : 0;

//   // Calculates total number of items
//   const totalItemsCount = Array.isArray(cart)
//     ? cart.reduce((acc, item) => acc + item.quantity, 0)
//     : 0;

//   // --- UPDATED HANDLERS FOR ARRAY ---
//   const removeItem = (productId) => {
//     const updatedCart = cart.filter(item => item._id !== productId);
//     setCart(updatedCart);
//     localStorage.setItem("ventire_cart", JSON.stringify(updatedCart));
//   };

//   const updateQuantity = (productId, newQty) => {
//     if (newQty < 1) return;
//     const updatedCart = cart.map(item =>
//       item._id === productId ? { ...item, quantity: newQty } : item
//     );
//     setCart(updatedCart);
//     localStorage.setItem("ventire_cart", JSON.stringify(updatedCart));
//   };
//   const [guestEmail, setGuestEmail] = useState("");
//   const [emailError, setEmailError] = useState(false); // New state for aesthetic validation
//   const checkout = async () => {
//     const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);
//     if (!address.street || !address.pincode || !address.phone) {
//       alert("Please fill in your delivery address and phone number.");
//       return;
//     }
//     // 2. Guest Logic
//     let currentUser = user;

//     if (!user) {
//       const proceedAsGuest = window.confirm(
//         "You are not logged in. Would you like to proceed as a Guest? \n\n(Note: You won't be able to track this order in 'My Orders')"
//       );

//       if (!proceedAsGuest) {
//         navigate("/Login");
//         return;
//       }
//       else {
//         // // If not logged in, ensure we have a guest email
//         // if (!user && !guestEmail) {
//         //   alert("Please provide an email address for order tracking.");
//         //   return;
//         // }
//         // 2. Aesthetic Guest Check


//         setEmailError(false); // Clear error if validation passes
//       }
//       const finalEmail = user ? user.email : guestEmail;
//       // Create a temporary guest object so the backend doesn't crash
//       currentUser = { _id: "guest_user", name: "Guest", email: "guest@ventire.com" };
//     }

//     try {
//       const resCreate = await fetch("/api/create-order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           // We now send the total amount and full cart info
//           amount: totalAmount,
//           quantity: totalItemsCount,
//           userId: user.id || user._id,
//           items: cart // Pass the full array to your backend
//         }),
//       });

//       const order = await resCreate.json();

//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: order.amount,
//         currency: "INR",
//         name: "Ventire",
//         description: "Ventire Purifier Order",
//         order_id: order.id,
//         prefill: {
//           name: user.name || currentUser.name,
//           email: user.email || finalEmail,
//         },
//         handler: async function (response) {
//           setIsProcessing(true);
//           try {
//             const res = await fetch("/api/store-order", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 orderId: response.razorpay_order_id,
//                 paymentId: response.razorpay_payment_id,
//                 signature: response.razorpay_signature,
//                 amount: totalAmount,
//                 // 🟢 ADD THIS LINE: This satisfies the Mongoose 'required' check
//                 quantity: totalQty,
//                 items: cart, // Store full array
//                 userId: user._id || currentUser._id,
//                 useremail: user.email || finalEmail,
//                 address: address,
//                 status: "paid",
//               }),
//             });

//             const data = await res.json();
//             if (data.success && data.displayId) {
//               setCart([]); // Clear Array
//               localStorage.removeItem("ventire_cart");
//               navigate(`/Success?orderNo=${data.displayId}`, { state: { address: address } });
//             } else {
//               navigate(`/Success?orderNo=${response.razorpay_order_id}`);
//             }
//           } catch (err) {
//             navigate("/Failure");
//           }
//         },
//         modal: { ondismiss: () => navigate("/failure") },
//         theme: { color: "#16a34a" },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       alert("Payment failed. Try again.");
//     }
//   };

//   // Check if cart array is empty
//   if (!cart || cart.length === 0) {
//     return (
//       <div className="pt-32 text-center">
//         <h2 className="text-2xl font-bold text-gray-400">Your cart is empty</h2>
//         <button onClick={() => navigate("/")} className="mt-4 text-green-600 font-semibold underline">
//           Continue Shopping
//         </button>
//       </div>
//     );
//   }
//   // Inside Cart Component
//   const [isGuestMode, setIsGuestMode] = useState(false);

//   const handleCheckoutClick = () => {
//     // Perform validation here, not in the component body
//     if (!user && (!guestEmail || !guestEmail.includes('@'))) {
//       setEmailError(true);
//       // Optional: scroll to the input so the user sees the error
//       document.getElementById('guest-input')?.scrollIntoView({ behavior: 'smooth' });
//       return;
//     }

//     // If valid, proceed to payment logic
//      checkout();
//     // If not logged in, show the Guest/Login selection UI
//     setIsGuestMode(true);
//   };
//   return (
//     <div className="pt-32 max-w-4xl mx-auto px-4 pb-20">
//       <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         {/* LEFT: Item List */}
//         <div className="md:col-span-2 space-y-4">
//           {cart.map((item) => (
//             <div key={item._id} className="bg-white p-4 rounded-xl shadow border border-gray-50 flex items-center gap-4">
//               <img src={item.images?.[0] || "/Air purifier.jpg"} alt="" className="w-20 h-20 object-contain" />
//               <div className="flex-1">
//                 <h3 className="font-bold text-gray-900">{item.name || "Ventire Purifier"}</h3>
//                 <p className="text-green-600 font-bold">₹{item.price}</p>

//                 <div className="flex items-center gap-4 mt-2">
//                   <div className="flex items-center border rounded-lg px-2 py-1">
//                     <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-2 text-gray-500 hover:text-green-600"><Minus size={16} /></button>
//                     <span className="px-2 font-bold">{item.quantity}</span>
//                     <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-2 text-gray-500 hover:text-green-600"><Plus size={16} /></button>
//                   </div>
//                   <button onClick={() => removeItem(item._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* RIGHT: Summary & Address */}
//         <div className="md:col-span-1">
//           <div className="bg-white p-6 rounded-xl shadow sticky top-32">
//             <h2 className="text-xl font-bold mb-4">Summary</h2>
//             <div className="flex justify-between mb-4 text-lg border-b pb-4">
//               <span className="text-gray-600">Total</span>
//               <span className="font-bold">₹{totalAmount}</span>
//             </div>

//             <div className="mt-4">
//               <p className="text-sm font-semibold text-gray-500 mb-2 uppercase">Shipping Address</p>
//               <AddressForm address={address} setAddress={setAddress} />
//             </div>

//             {/* <button
//               onClick={checkout}
//               className="w-full mt-6 bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition-all"
//             >
//               Proceed to Pay ₹{totalAmount}
//             </button> */}
//             {/* Guest Email Section */}
//             {!user && (
//               <div id="guest-email-section" className="mb-8 animate-in fade-in duration-500">
//                 <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${emailError ? "border-red-200 bg-red-50 shadow-sm" : "border-gray-100 bg-white"
//                   }`}>
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">
//                       Contact Information
//                     </h3>
//                     {emailError && (
//                       <span className="text-xs font-bold text-red-500 animate-pulse">
//                         Email is required for tracking
//                       </span>
//                     )}
//                   </div>

//                   <div className="relative">
//                     <input
//                       type="email"
//                       placeholder="Enter your email address"
//                       value={guestEmail}
//                       onChange={(e) => {
//                         setGuestEmail(e.target.value);
//                         if (emailError) setEmailError(false);
//                       }}
//                       className={`w-full p-4 rounded-xl outline-none transition-all ${emailError
//                           ? "bg-white border-2 border-red-500 ring-4 ring-red-50"
//                           : "bg-gray-50 border border-gray-200 focus:bg-white focus:border-green-500"
//                         }`}
//                     />
//                     <p className="text-[11px] text-gray-400 mt-2 ml-1">
//                       We’ll send your order confirmation and VT-ID here.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div className="mt-8 border-t pt-8">
//               {!user && isGuestMode ? (
//                 <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 animate-in fade-in slide-in-from-bottom-4">
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="font-bold text-gray-900">Guest Checkout</h3>
//                     <button onClick={() => setIsGuestMode(false)} className="text-xs text-gray-500 underline">Back</button>
//                   </div>

//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
//                       <input
//                         type="email"
//                         placeholder="your@email.com"
//                         value={guestEmail}
//                         onChange={(e) => setGuestEmail(e.target.value)}
//                         className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
//                       />
//                     </div>

//                     <button
//                       onClick={checkout}
//                       disabled={!guestEmail.includes('@')}
//                       className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 disabled:bg-gray-300 transition-all"
//                     >
//                       Pay as Guest ₹{totalAmount}
//                     </button>

//                     <p className="text-center text-sm text-gray-500">
//                       Already have an account?
//                       <button onClick={() => navigate('/Login')} className="ml-1 text-green-600 font-bold">Login</button>
//                     </p>
//                   </div>
//                 </div>
//               ) : (
//                 <button
//                   onClick={handleCheckoutClick}
//                   className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 shadow-xl shadow-green-100 transition-all flex items-center justify-center gap-2"
//                 >
//                   {user ? `Proceed to Pay ₹${totalAmount}` : "Checkout Now"}
//                 </button>
//               )}
//             </div>

//             <p className="text-xs text-center text-gray-400 mt-4">
//               Secure Checkout Powered by Razorpay
//             </p>
//           </div>
//         </div>
//       </div>

//       {isProcessing && (
//         <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md">
//           <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
//           <h2 className="text-2xl font-bold text-gray-900">Processing Your Order...</h2>
//           <p className="text-gray-500 mt-2 text-center px-4">Secure transaction in progress. Please do not close.</p>
//         </div>
//       )}
//     </div>
//   );
// }
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AddressForm from "../components/AddressForm";
import { Trash2, ShieldCheck, Minus, Plus } from "lucide-react";

export default function Cart({ cart, setCart }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);

  const [address, setAddress] = useState({
    street: '',
    city: '',
    pincode: '',
    phone: ''
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const totalAmount = Array.isArray(cart) ? cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) : 0;
  const totalItemsCount = Array.isArray(cart) ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;

  const removeItem = (productId) => {
    const updatedCart = cart.filter(item => item._id !== productId);
    setCart(updatedCart);
    localStorage.setItem("ventire_cart", JSON.stringify(updatedCart));
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) return;
    const updatedCart = cart.map(item => item._id === productId ? { ...item, quantity: newQty } : item);
    setCart(updatedCart);
    localStorage.setItem("ventire_cart", JSON.stringify(updatedCart));
  };

  const checkout = async () => {
    // 1. Validation
    if (!address.street || !address.pincode || !address.phone) {
      alert("Please fill in your delivery address and phone number.");
      return;
    }

    // Identify who is buying
    let currentUserData = user;


    if (!user) {
      if (!guestEmail || !guestEmail.includes('@')) {
        setEmailError(true);
        document.getElementById('guest-email-section')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      currentUserData = { _id: "guest", name: "Guest", email: guestEmail };
    }
    let finalEmail = user ? user.email : guestEmail;
    try {
      // 2. Create Razorpay Order
      const resCreate = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          quantity: totalItemsCount,
          userId: user._id || currentUserData._id,
        }),
      });

      const order = await resCreate.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Ventire",
        description: "Ventire Purifier Order",
        order_id: order.id,
        prefill: {
          name: user ? user.name : "Guest Customer",
          email: finalEmail,
          contact: address.phone
        },
        handler: async function (response) {
          setIsProcessing(true);
          try {
            const res = await fetch("/api/store-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                amount: totalAmount,
                quantity: totalItemsCount,
                items: cart,
                userId: user._id || currentUserData._id,
                useremail: finalEmail,
                address: address,
                status: "paid",
              }),
            });

            const data = await res.json();
            if (data.success) {
              setCart([]);
              localStorage.removeItem("ventire_cart");
              navigate(`/Success?orderNo=${data.displayId}`, { state: { address } });
            }
          } catch (err) {
            navigate("/Failure");
          }
        },
        modal: { ondismiss: () => setIsProcessing(false) },
        theme: { color: "#16a34a" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Payment initiation failed.");
    }
  };

  const handleCheckoutClick = () => {
    if (user) {
      checkout();
    } else {
      setIsGuestMode(true);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="pt-32 text-center">
        <h2 className="text-2xl font-bold text-gray-400">Your cart is empty</h2>
        <button onClick={() => navigate("/")} className="mt-4 text-green-600 font-semibold underline">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 max-w-4xl mx-auto px-4 pb-20">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded-xl shadow border border-gray-50 flex items-center gap-4">
              <img src={item.images?.[0] || "/Air purifier.jpg"} alt="" className="w-20 h-20 object-contain" />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{item.name}</h3>
                <p className="text-green-600 font-bold">₹{item.price}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center border rounded-lg px-2 py-1">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}><Minus size={14} /></button>
                    <span className="px-3 font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}><Plus size={14} /></button>
                  </div>
                  <button onClick={() => removeItem(item._id)} className="text-red-500"><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow sticky top-32">
            <h2 className="text-xl font-bold mb-4">Summary</h2>
            <div className="flex justify-between mb-6 border-b pb-4">
              <span>Total</span>
              <span className="font-bold">₹{totalAmount}</span>
            </div>

            <div className="mb-6">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Shipping Address</p>
              <AddressForm address={address} setAddress={setAddress} />
            </div>

            {isGuestMode && !user && (
              <div id="guest-email-section" className="mb-6 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <label className="block text-xs font-bold mb-2">Email for tracking</label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => { setGuestEmail(e.target.value); setEmailError(false); }}
                  className={`w-full p-3 rounded-lg border ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="your@email.com"
                />
                {emailError && <p className="text-red-500 text-[10px] mt-1">Valid email required</p>}
              </div>
            )}

            <button
              onClick={isGuestMode || user ? checkout : handleCheckoutClick}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all"
            >
              {user ? `Pay ₹${totalAmount}` : isGuestMode ? "Finalize Guest Order" : "Checkout Now"}
            </button>

            {!user && !isGuestMode && (
              <button onClick={() => navigate('/Login')} className="w-full mt-3 text-sm text-green-600 font-medium">
                Or Login to your account
              </button>
            )}
          </div>
        </div>
      </div>

      {isProcessing && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold">Processing Order...</h2>
        </div>
      )}
    </div>
  );
}