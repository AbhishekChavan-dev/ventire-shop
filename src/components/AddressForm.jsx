import React from 'react';

export default function AddressForm({ address, setAddress }) {
  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4 border border-green-100 rounded-xl bg-green-50/30 space-y-3">
      <h3 className="font-bold text-gray-800 text-sm mb-2 uppercase tracking-tight">Delivery Details</h3>
      <input
        type="text" name="street" placeholder="Flat / House No. / Street"
        className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
        value={address.street} onChange={handleChange}
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text" name="city" placeholder="City"
          className="p-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
          value={address.city} onChange={handleChange}
        />
        <input
          type="text" name="pincode" placeholder="Pincode"
          className="p-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
          value={address.pincode} onChange={handleChange}
        />
      </div>
      <input
        type="tel" name="phone" placeholder="Phone Number for Delivery"
        className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
        value={address.phone} onChange={handleChange}
      />
    </div>
  );
}