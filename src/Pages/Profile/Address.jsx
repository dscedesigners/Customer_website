import React, { useState } from "react";

const Address = () => {
  // We start with one sample address for demonstration
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      fullName: "John Doe",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      country: "USA",
      zipCode: "10001",
    },
  ]);

  const [newAddress, setNewAddress] = useState({
    fullName: "", street: "", city: "", state: "", country: "", zipCode: "",
  });
  
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // --- API LOGIC REMOVED ---
  // const [updateUser] = useUpdateUserMutation(); 

  const handleAddAddress = () => {
    if (Object.values(newAddress).some((field) => field.trim() === "")) {
      alert("Please fill out all fields.");
      return;
    }
    const updatedAddresses = [...addresses, { ...newAddress, id: Date.now() }];
    setAddresses(updatedAddresses);
    setNewAddress({ fullName: "", street: "", city: "", state: "", country: "", zipCode: "" });
    setIsAdding(false);
    // await updateUser({ userId, data: { address: updatedAddresses } }); // This will be added later
  };

  const handleSaveEdit = () => {
    const updatedAddresses = addresses.map((address) =>
      address.id === editingId ? { ...newAddress, id: editingId } : address
    );
    setAddresses(updatedAddresses);
    setNewAddress({ fullName: "", street: "", city: "", state: "", country: "", zipCode: "" });
    setIsEditing(false);
    setIsAdding(false);
    // await updateUser({ userId, data: { address: updatedAddresses } }); // This will be added later
  };

  const handleDeleteAddress = (id) => {
    const updatedAddresses = addresses.filter((address) => address.id !== id);
    setAddresses(updatedAddresses);
    // await updateUser({ userId, data: { address: updatedAddresses } }); // This will be added later
  };

  const handleEditAddress = (id) => {
    const addressToEdit = addresses.find((address) => address.id === id);
    setNewAddress({ ...addressToEdit });
    setIsAdding(true);
    setIsEditing(true);
    setEditingId(id);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-4 mb-6">Manage Addresses</h2>
      
      {!isAdding && !isEditing && (
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Address
        </button>
      )}

      {(isAdding || isEditing) && (
        <div className="space-y-4 mt-4">
          <h3 className="text-2xl font-semibold text-gray-700">
            {isEditing ? "Edit Address" : "Add New Address"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" value={newAddress.fullName} onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} className="input-field" />
            <input type="text" placeholder="Street" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} className="input-field" />
            <input type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} className="input-field" />
            <input type="text" placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} className="input-field" />
            <input type="text" placeholder="Country" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} className="input-field" />
            <input type="text" placeholder="Zip Code" value={newAddress.zipCode} onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })} className="input-field" />
          </div>
          <div className="flex space-x-4">
            <button onClick={isEditing ? handleSaveEdit : handleAddAddress} className="btn-primary w-full">
              {isEditing ? "Save Changes" : "Add Address"}
            </button>
            <button onClick={() => { setIsAdding(false); setIsEditing(false); }} className="bg-gray-500 text-white p-3 w-full rounded-lg">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4 mt-8">
        {addresses.map((address) => (
          <div key={address.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border">
            <h3 className="text-xl font-semibold text-gray-800">{address.fullName}</h3>
            <p className="text-gray-600">{address.street}, {address.city}, {address.state}, {address.country} - {address.zipCode}</p>
            <div className="mt-4 space-x-2">
              <button onClick={() => handleEditAddress(address.id)} className="bg-yellow-500 text-white px-4 py-1 rounded-md text-sm">
                Edit
              </button>
              <button onClick={() => handleDeleteAddress(address.id)} className="bg-red-500 text-white px-4 py-1 rounded-md text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Address;