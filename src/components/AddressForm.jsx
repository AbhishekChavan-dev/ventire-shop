// import React from 'react';

// export default function AddressForm({ address, setAddress }) {
//   const handleChange = (e) => {
//     setAddress({ ...address, [e.target.name]: e.target.value });
//   };

//   return (
//     <div className="p-4 border border-green-100 rounded-xl bg-green-50/30 space-y-3">
//       <h3 className="font-bold text-gray-800 text-sm mb-2 uppercase tracking-tight">Delivery Details</h3>
//       <input
//         type="text" name="street" placeholder="Flat / House No. / Street"
//         className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
//         value={address.street} onChange={handleChange}
//       />
//       <div className="grid grid-cols-2 gap-3">
//         <input
//           type="text" name="city" placeholder="City"
//           className="p-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
//           value={address.city} onChange={handleChange}
//         />
//         <input
//           type="text" name="pincode" placeholder="Pincode"
//           className="p-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
//           value={address.pincode} onChange={handleChange}
//         />
//       </div>
//       <input
//         type="tel" name="phone" placeholder="Phone Number for Delivery"
//         className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
//         value={address.phone} onChange={handleChange}
//       />
//     </div>
//   );
// }
import React, { useState } from 'react';

const AddressForm = ({ address, setAddress }) => {
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));

    // Trigger Pincode Lookup at 6 digits
    if (name === 'pincode' && value.length === 6) {
      fetchCityState(value);
    }

    // Trigger Email Suggestions
    if (name === 'email') {
      handleEmailLogic(value);
    }
  };

  const fetchCityState = async (pin) => {
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      if (data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        setAddress(prev => ({
          ...prev,
          city: postOffice.District,
          state: postOffice.State
        }));
      }
    } catch (err) {
      console.error("Pincode fetch failed");
    }
  };

  const handleEmailLogic = (val) => {
    if (val.includes('@')) {
      const [user, domain] = val.split('@');
      const matches = domains
        .filter(d => d.startsWith(domain))
        .map(d => `${user}@${d}`);
      setEmailSuggestions(matches);
    } else {
      setEmailSuggestions([]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Email with Dropdown */}
      <div className="relative md:col-span-2">
        <input
          name="email"
          placeholder="Email Address"
          value={address.email || ''}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {emailSuggestions.length > 0 && (
          <div className="absolute z-50 w-full bg-white border rounded-b-lg shadow-xl">
            {emailSuggestions.map((s) => (
              <div 
                key={s}
                className="p-3 hover:bg-blue-50 cursor-pointer text-sm"
                onClick={() => {
                  setAddress(prev => ({ ...prev, email: s }));
                  setEmailSuggestions([]);
                }}
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Standard Fields */}
      <input name="fullName" placeholder="Full Name" value={address.fullName || ''} onChange={handleChange} className="p-3 border rounded-lg" />
      <input name="phone" placeholder="Phone Number" value={address.phone || ''} onChange={handleChange} className="p-3 border rounded-lg" />
      <input name="pincode" placeholder="Pincode (6 digits)" value={address.pincode || ''} onChange={handleChange} maxLength="6" className="p-3 border rounded-lg font-bold" />
      
      {/* City & State (Auto-filled) */}
      <input name="city" placeholder="City" value={address.city || ''} onChange={handleChange} className="p-3 border rounded-lg bg-gray-50" readOnly />
      <input name="state" placeholder="State" value={address.state || ''} onChange={handleChange} className="p-3 border rounded-lg bg-gray-50" readOnly />
      
      <input name="addressLine" placeholder="House No, Street, Area" value={address.addressLine || ''} onChange={handleChange} className="md:col-span-2 p-3 border rounded-lg" />
    </div>
  );
};

export default AddressForm;