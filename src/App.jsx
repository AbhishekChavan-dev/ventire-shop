import { Routes, Route, Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import Cart from "./pages_temp/Cart";
import Success from "./pages_temp/Success";
import Failure from "./pages_temp/Failure";
import Login from "./pages_temp/LoginAuth.jsx";
import React, { useState, useEffect } from 'react';

import { ShoppingBag, Wind, Leaf, ShieldCheck, Zap, Droplets, Menu, X, ArrowRight, Star, Check } from 'lucide-react';


// --- Components ---



// 1. Wind & Leaf Animation Component

const WindAnimation = () => {

  // Generate random leaves with different properties for organic movement

  const leaves = Array.from({ length: 12 }).map((_, i) => ({

    id: i,

    left: `${Math.random() * 100}%`,

    animationDelay: `${Math.random() * 5}s`,

    animationDuration: `${10 + Math.random() * 10}s`,

    scale: 0.5 + Math.random() * 0.5,

    rotation: Math.random() * 360,

  }));



  return (

    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">

      {leaves.map((leaf) => (

        <div

          key={leaf.id}

          className="absolute opacity-60 text-green-400/40 animate-float-wind"

          style={{

            left: '-50px', // Start off-screen

            top: leaf.left, // Use left as vertical distribution for variety

            animationDelay: leaf.animationDelay,

            animationDuration: leaf.animationDuration,

            transform: `scale(${leaf.scale}) rotate(${leaf.rotation}deg)`,

          }}

        >

          <Leaf size={24} fill="currentColor" />

        </div>

      ))}

      {/* CSS for custom animation inserted via style tag for self-containment */}

      <style>{`

        @keyframes float-wind {

          0% {

            transform: translateX(-10vw) translateY(0) rotate(0deg);

            opacity: 0;

          }

          10% {

            opacity: 0.6;

          }

          90% {

            opacity: 0.6;

          }

          100% {

            transform: translateX(110vw) translateY(-50px) rotate(720deg);

            opacity: 0;

          }

        }

        .animate-float-wind {

          animation-name: float-wind;

          animation-timing-function: linear;

          animation-iteration-count: infinite;

        }

      `}</style>

    </div>

  );

};



// 2. Navigation Bar

const Navbar = ({ cart, user }) => {

  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isCartPage = location.pathname === "/cart";
  // Logic to handle logout
  const handleLogout = () => {
    localStorage.clear(); // Clears user, token, AND ventire_cart
    setUser(null);
    setCart({ quantity: 0 });
    window.location.href = "/login"; // Force refresh to clear state
  };
  return (

    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-green-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between items-center h-20">

          <div className="flex items-center space-x-2">

            {/*<div className="bg-green-100 p-2 rounded-full">

              <Wind className="h-6 w-6 text-green-600" />

            </div>*/}
            <div className="flex items-center space-x-3">
              <img
                src="/Ventire-logo.png"
                alt="Ventire Logo"
                className="h-10 w-absolute"
              />
            </div>
            <span className="text-2xl font-extrabold tracking-wide
                    bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500
                    text-transparent bg-clip-text">
              Ventire
            </span>
          </div>



          <div className="hidden md:flex items-center space-x-8">
            {/* SHOW ONLY ON HOME */}
            {!isCartPage && (
              <>
                <a href="#home" className="text-gray-600 hover:text-green-600">Home</a>
                <a href="#features" className="text-gray-600 hover:text-green-600">Technology</a>
                <a href="#product" className="text-gray-600 hover:text-green-600">Shop</a>
                {/* 👤 PROFILE LOGIC START */}
                {user ? (
                  <div className="flex items-center gap-4 border-l pl-8 border-gray-100">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-gray-900">{user.name}</span>
                      <button
                        onClick={handleLogout}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Logout
                      </button>
                    </div>
                    
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-200">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                ) : (
                  <Link to="/login" className="text-gray-600 hover:text-green-600 font-semibold">
                    Login
                  </Link>
                )}
                {/* 👤 PROFILE LOGIC END */}
                <Link
                  to="/cart"
                  className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700"
                >
                  Cart ({cart.quantity})
                </Link>
              </>
            )}

            {/* SHOW ONLY ON CART */}
            {isCartPage && (
              <Link
                to="/"
                className="bg-gray-900 text-white px-5 py-2 rounded-full hover:bg-gray-800"
              >
                ← Back to Home
              </Link>
            )}

            {/*<a href="#home" className="text-gray-600 hover:text-green-600 transition-colors">Home</a>
            <Link
              to="/"
              className="inline-block mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              ← Back to Home
            </Link>

            <a href="#features" className="text-gray-600 hover:text-green-600 transition-colors">Technology</a>

            <a href="#product" className="text-gray-600 hover:text-green-600 transition-colors">Shop</a>

            <a href="#reviews" className="text-gray-600 hover:text-green-600 transition-colors">Reviews</a>

            {/*<button className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center space-x-2">

              <ShoppingBag size={18} />

              <span>Cart ({cart.quantity})</span>


            </button>*/}{/*}
            <Link
              to="/cart"
              className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition-all shadow-lg shadow-green-200"
            >
              Cart ({cart.quantity})
            </Link>*/}
          </div>



          {/*<div className="md:hidden">

            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2">

              {isOpen ? <X size={24} /> : <Menu size={24} />}

            </button>

          </div>*/}
          <div className="md:hidden flex items-center gap-4">
            {/* Mobile Cart Button */}
            <Link to="/cart" className="relative">
              <ShoppingBag size={24} className="text-green-600" />
              {cart.quantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cart.quantity}
                </span>
              )}
            </Link>
            <Link to="/login" className="text-gray-600 hover:text-green-600 font-semibold">
              Login
            </Link>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

      </div>



      {/* Mobile Menu */}

      {isOpen && (

        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full">

          <div className="px-4 pt-2 pb-6 space-y-2 shadow-lg">
            {isCartPage && (
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-center bg-green-600 text-white rounded-lg font-semibold"
              >
                ← Back to Home
              </Link>
            )} {!isCartPage && (
              <>
                <a href="#home" className="block px-3 py-2 text-gray-600 hover:bg-green-50 rounded-md">Home</a>
                <a href="#features" className="block px-3 py-2 text-gray-600 hover:bg-green-50 rounded-md">Technology</a>
                <a href="#product" className="block px-3 py-2 text-gray-600 hover:bg-green-50 rounded-md">Shop</a>

                <Link
                  to="/cart"
                  onClick={() => setIsOpen(false)}
                  className="block mt-4 bg-green-600 text-white px-5 py-3 rounded-lg text-center"
                >
                  Cart ({cart.quantity})
                </Link>
              </>
            )}
          </div>
          {/*}
            <a href="#home" className="block px-3 py-2 text-gray-600 hover:bg-green-50 rounded-md">Home</a>

            <a href="#features" className="block px-3 py-2 text-gray-600 hover:bg-green-50 rounded-md">Technology</a>

            <a href="#product" className="block px-3 py-2 text-gray-600 hover:bg-green-50 rounded-md">Shop</a>

            <button className="w-full mt-4 bg-green-600 text-white px-5 py-3 rounded-lg flex justify-center items-center space-x-2">

              <ShoppingBag size={18} />

            </button>
            <Link
              to="/cart"
              className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition-all shadow-lg shadow-green-200"
            >
              Cart ({cart.quantity})
            </Link>*/}

        </div>

      )}

    </nav>

  )
};


// 3. Hero Section

const Hero = () => {

  return (

    <div id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-b from-blue-50/50 to-white">

      <WindAnimation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center max-w-3xl mx-auto">

          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-medium mb-6">

            <Leaf size={14} />

            <span>New Eco-Friendly H13 Technology</span>

          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 tracking-tight leading-tight">

            Breathe Pure. <br />

            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">

              Live Naturally.

            </span>

          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">

            Experience whole-house purification with the new Ventire Air Cleaner.

            Removing allergens, dust, and odors with whisper-quiet eco-efficiency.

          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">

            <a href="#product" className="bg-green-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition-all shadow-xl shadow-green-200 flex items-center justify-center space-x-2 group">

              <span>Shop Now</span>

              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />

            </a>

            <a href="#features" className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all flex items-center justify-center">

              Learn More

            </a>

          </div>

        </div>

      </div>

    </div>

  );

};



// 4. Product Showcase Section

const ProductShowcase = ({ cart, setCart }) => {

  const [activeImage, setActiveImage] = useState(0);

  // ✅ QUANTITY STATE
  const [quantity, setQuantity] = useState(1);
  const [addedMsg, setAddedMsg] = useState(false)
  const PRICE = 2499;
  const totalAmount = PRICE * quantity;
  const mrp = 3499;
  const mrpamount = mrp * quantity;



  // NOTE: In a real deployment, replace this URL with the uploaded image path or a hosted URL.

  // Using a placeholder that resembles the white cylindrical purifier described.

  const productImages = [

    "/Air purifier.jpg",

    // Ideally, the second image would be the specific one uploaded by the user

  ];

  const buyNow = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login to purchase");
      navigate("/login");
      return;
    }
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity,
          userId: user.id // 👈 Pass the ID here
        }),
      }
      );

      const order = await res.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Ventire",
        description: "Ventire Air Purifier",
        order_id: order.id,

        // ✅ SUCCESS
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
                status: "paid",
                userId: user.id,//added
              }),
            });
            window.location.href =
              (`/Success?orderId=${response.razorpay_payment_id}`);
          } catch (err) {
            console.error("Order save failed", err);
            navigate("/Failure");
          }
        },

        // ❌ FAILURE / CANCEL
        modal: {
          ondismiss: function () {
            window.location.href = "/failure";
          },
        },

        theme: { color: "#16a34a" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Buy Now error:", err);
      alert("Unable to start payment. Try again.");
    }
  };


  const addToCart = () => {
    setCart({
      quantity: cart.quantity + quantity,
    });

    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2000);
  };

  return (

    <div id="product" className="py-24 bg-white relative">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">



          {/* Image Gallery */}

          <div className="relative group">

            <div className="absolute inset-0 bg-gradient-to-tr from-green-100 to-blue-50 rounded-3xl transform -rotate-2 scale-105 group-hover:rotate-0 transition-transform duration-500"></div>

            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

              {/* Badge */}

              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">

                Sale -28%

              </div>

              <img
                src={productImages[0]}
                alt="Ventire Air Purifier"
                className="
                           w-full 
                           h-auto 
                           md:h-[500px] 
                           object-contain 
                           md:object-cover 
                           object-center 
                           transition-transform 
                           duration-700
                           "
              />

              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-xs text-gray-500 border border-gray-200">

                *Model shown is Ventire Pure-X1

              </div>

            </div>

          </div>



          {/* Product Details */}

          <div>

            <div className="mb-2 text-green-600 font-semibold uppercase tracking-wider text-sm">Best Seller</div>

            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ventire Smart Air Purifier</h2>



            <div className="flex items-center space-x-4 mb-6">

              <div className="flex text-yellow-400">

                {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}

              </div>

              <span className="text-gray-500 text-sm">(428 Reviews)</span>

            </div>



            <div className="mb-8">

              <span className="text-gray-400 text-2xl line-through mr-3">{mrpamount}</span>

              <span className="text-5xl font-bold text-gray-900">
                ₹{totalAmount}
              </span>

              <p className="text-green-600 text-sm mt-2 font-medium">Inclusive of all taxes</p>

            </div>
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-4 py-2 border rounded-lg text-xl"
              >
                −
              </button>

              <span className="text-lg font-semibold">{quantity}</span>

              <button
                onClick={() => setQuantity(q => q + 1)}
                className="px-4 py-2 border rounded-lg text-xl"
              >
                +
              </button>
            </div>



            <div className="space-y-4 mb-8">

              <FeatureRow icon={<ShieldCheck className="text-green-500" />} text="H13 Level HEPA Filter Element" />

              <FeatureRow icon={<Wind className="text-blue-500" />} text="Removes Bacterial Allergens & Dust" />

              <FeatureRow icon={<Zap className="text-yellow-500" />} text="Formaldehyde & Smoke Removal" />

              <FeatureRow icon={<Droplets className="text-purple-500" />} text="Aromatherapy Storage Box Included" />

            </div>



            {/* <div className="flex items-center space-x-4">

              <button
  onClick={handlePayment}
  className="flex-1 bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition"
>
  Pay ₹{totalAmount}
</button>

              <button className="p-4 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:text-green-500 transition-colors">

                <Star size={24} />

              </button>

            </div> */}
            <div className="flex items-center space-x-4">
              {addedMsg && (
                <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg z-50">
                  ✅ Added to cart
                </div>
              )}
              {/* Add to Cart */}
              <button
                onClick={addToCart}
                className="flex-1 bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition"
              >
                Add to Cart
              </button>

              {/* Buy Now */}
              <button
                onClick={buyNow}
                className="flex-1 bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition"
              >
                Buy Now ₹{totalAmount}
              </button>

            </div>




            <p className="mt-6 text-sm text-gray-500 flex items-center">

              <Check size={16} className="text-green-500 mr-2" />

              Free Delivery in 8-10 Days

            </p>

          </div>

        </div>

      </div>

    </div>

  );

};



const FeatureRow = ({ icon, text }) => (

  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors">

    {icon}

    <span className="text-gray-700 font-medium">{text}</span>

  </div>

);



// 5. Features Grid Section

const Features = () => {

  const features = [

    {

      title: "H13 HEPA Filtration",

      desc: "Captures 99.97% of airborne particles as small as 0.3 microns.",

      icon: <ShieldCheck size={32} className="text-white" />,

      color: "bg-blue-500"

    },

    {

      title: "Quiet Operation",

      desc: "Sleep mode ensures purification without disturbing your dreams.",

      icon: <Wind size={32} className="text-white" />,

      color: "bg-teal-500"

    },

    {

      title: "Aromatherapy",

      desc: "Built-in storage box to add your favorite essential oils.",

      icon: <Droplets size={32} className="text-white" />,

      color: "bg-purple-500"

    },

    {

      title: "Energy Efficient",

      desc: "Uses less energy than a standard lightbulb. Eco-friendly design.",

      icon: <Leaf size={32} className="text-white" />,

      color: "bg-green-500"

    }

  ];



  return (

    <div id="features" className="py-24 bg-gray-50 relative overflow-hidden">

      {/* Background Decor */}

      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-green-200 rounded-full opacity-20 blur-3xl"></div>



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center max-w-2xl mx-auto mb-16">

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Ventire?</h2>

          <p className="text-gray-600">Our advanced triple-filtration system ensures your home is safe from pollutants, allergens, and odors.</p>

        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((feature, idx) => (

            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 group">

              <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg transform group-hover:-translate-y-1 transition-transform`}>

                {feature.icon}

              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>

              <p className="text-gray-500 leading-relaxed">{feature.desc}</p>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

};



// 6. Footer

const Footer = () => {

  return (

    <footer className="bg-gray-900 text-white pt-16 pb-8">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          <div className="col-span-1 md:col-span-1">

            <div className="flex items-center space-x-2 mb-6">

              <div className="bg-green-500 p-2 rounded-full">

                <Wind className="h-5 w-5 text-white" />

              </div>

              <span className="text-2xl font-bold tracking-tight">Ventire</span>

            </div>

            <p className="text-gray-400 text-sm leading-relaxed">

              Bringing the freshness of nature into your modern home. Professional purification solutions.

            </p>

          </div>



          <div>

            <h4 className="text-lg font-semibold mb-6">Shop</h4>

            <ul className="space-y-4 text-gray-400">

              <li><a href="#" className="hover:text-green-400 transition-colors">Air Purifiers</a></li>

              <li><a href="#" className="hover:text-green-400 transition-colors">Filters</a></li>

              <li><a href="#" className="hover:text-green-400 transition-colors">Accessories</a></li>

            </ul>

          </div>



          <div>

            <h4 className="text-lg font-semibold mb-6">Support</h4>

            <ul className="space-y-4 text-gray-400">

              <li><a href="#" className="hover:text-green-400 transition-colors">User Manuals</a></li>

              <li><a href="#" className="hover:text-green-400 transition-colors">Warranty</a></li>

              <li><a href="#" className="hover:text-green-400 transition-colors">Contact Us</a></li>

            </ul>

          </div>



          <div>

            <h4 className="text-lg font-semibold mb-6">Newsletter</h4>

            <p className="text-gray-400 text-sm mb-4">Subscribe for eco-tips and exclusive offers.</p>

            <div className="flex">

              <input type="email" placeholder="Email address" className="bg-gray-800 text-white px-4 py-2 rounded-l-lg w-full focus:outline-none focus:ring-1 focus:ring-green-500" />

              <button className="bg-green-600 px-4 py-2 rounded-r-lg hover:bg-green-700 transition-colors">

                <ArrowRight size={18} />

              </button>

            </div>

          </div>

        </div>



        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">

          <p>© 2024 Ventire Inc. All rights reserved.</p>

          <div className="flex space-x-6 mt-4 md:mt-0">

            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>

            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>

          </div>

        </div>

      </div>

    </footer>

  );

};



// Main App Component

const App = () => {

  // 🛒 CART STATE
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("ventire_cart");
    return saved ? JSON.parse(saved) : { quantity: 0 };
  });

  useEffect(() => {
    localStorage.setItem("ventire_cart", JSON.stringify(cart));
  }, [cart]);
  // 👤 AUTH STATE (New Logic Added Here)
  const [user, setUser] = useState(null);
  // Function to be called by Login.jsx upon success
  const handleLoginSuccess = (userData) => {
    setUser(userData); // This triggers an immediate UI re-render
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null); // This triggers an immediate UI re-render
    navigate("/");
  };
  // Sync Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem("ventire_cart", JSON.stringify(cart));
  }, [cart]);

  // Sync User session on Page Load (New Logic Added Here)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  return (
    <div className="font-sans antialiased bg-white text-gray-900">
      <Navbar cart={cart} user={user} onLogout={handleLogout} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <ProductShowcase cart={cart} setCart={setCart} />
              <Features />
            </>
          }
        />

        <Route
          path="/cart"
          element={<Cart cart={cart} setCart={setCart} />}
        />


        <Route path="/success" element={<Success />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/failure" element={<Failure />} />
      </Routes>

      <Footer />
    </div>
  );


};
export default App;