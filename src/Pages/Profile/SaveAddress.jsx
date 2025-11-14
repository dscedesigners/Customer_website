import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMoreVertical, FiSearch } from 'react-icons/fi';
import AddAddressForm from './AddAddressForm';
import EditAddressModal from './EditAddressModal';

import {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} from '../../redux/services/addressSlice'; // Adjust this path as needed

const initialNewAddressState = {
  fullName: '',
  email: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'India',
  contactPhone: '',
  alternateContactPhone: '',
};

const SavedAddress = () => {
  const { data: addressData, isLoading, error } = useGetAddressesQuery({ page: 1, limit: 10 });
  // FIX: Use `id` from your API response
  const addresses = addressData?.addresses || [];

  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();

  const [menuOpen, setMenuOpen] = useState(null); 
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editData, setEditData] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id).unwrap();
      setMenuOpen(null); 
    } catch (err) {
      console.error('Failed to set default address:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAddress(id).unwrap();
      setMenuOpen(null); 
    } catch (err) {
      console.error('Failed to delete address:', err);
    }
  };

  const handleEditClick = (addr) => {
    setEditData(addr); 
    setEditModalOpen(true);
    setMenuOpen(null); 
  };

  const handleEditSave = async (updatedFormData) => {
    // FIX: Use `id` here
    if (!editData?.id) return;

    try {
      // FIX: Use `id` here
      await updateAddress({ id: editData.id, ...updatedFormData }).unwrap();
      setEditModalOpen(false);
      setEditData(null);
    } catch (err) {
      console.error('Failed to update address:', err);
    }
  };

  const handleAddSubmit = async (formData) => {
    try {
      await createAddress(formData).unwrap();
      setAddModalOpen(false);
    } catch (err) {
      console.error('Failed to add address:', err);
    }
  };

  const filteredAddresses = addresses.filter((addr) =>
    (addr.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (addr.street || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative max-w-4xl mx-auto p-6 bg-white rounded shadow">
      {/* (Navigation, Search, Add New button...) */}
      <button
        onClick={() => navigate('/')}
        className="text-gray-800 hover:text-blue-600 text-sm font-medium flex items-center mb-2"
      >
        &lt; Shopping Continue
      </button>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Saved Address</h2>
        <p className="text-sm text-gray-600 mb-4">You have {addresses.length} saved address</p>

        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center border border-gray-300 rounded-full px-3 py-2 w-full max-w-md">
            <FiSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search by name or address"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm placeholder-gray-400 focus:outline-none"
              autoComplete="off" 
            />
          </div>

          <button
            onClick={() => {
              setAddModalOpen(true);
            }}
            className="bg-black text-white px-8 py-2 rounded-full hover:bg-gray-800 transition"
          >
            Add New
          </button>
        </div>
      </div>

      {/* Address List */}
      <div className="space-y-4">
        {isLoading ? (
          <p>Loading addresses...</p>
        ) : error ? (
          <p className="text-red-500">Failed to load addresses.</p>
        ) : (
          filteredAddresses.map((addr) => (
            // FIX: Use `id` for the key
            <div key={addr.id} className="border border-gray-300 rounded p-4 relative">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{addr.fullName}</h3>
                  <p className="text-sm text-gray-600">{addr.contactPhone}</p>
                  <p className="text-sm text-gray-600">
                    {addr.street}
                    {/* Show city/state/zip only if they exist in the response */}
                    {addr.city && `, ${addr.city}`}
                    {addr.state && `, ${addr.state}`}
                    {addr.zipCode && `, ${addr.zipCode}`}
                  </p>
                  {addr.isDefault && (
                    <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </div>

                <div className="relative">
                  {/* FIX: Use `id` to set the open menu */}
                  <button onClick={() => setMenuOpen(menuOpen === addr.id ? null : addr.id)}>
                    <FiMoreVertical size={20} className="text-gray-600" />
                  </button>

                  {/* FIX: Use `id` to check which menu to show */}
                  {menuOpen === addr.id && (
                    <ul className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-10">
                      {!addr.isDefault && (
                        <li
                          // FIX: Use `id` in handler
                          onClick={() => handleSetDefault(addr.id)}
                          className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                          Set as default
                        </li>
                      )}
                      <li
                        onClick={() => handleEditClick(addr)}
                        className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      >
                        Edit address
                      </li>
                      <li
                        // FIX: Use `id` in handler
                        onClick={() => handleDelete(addr.id)}
                        className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                      >
                        Delete
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      {editModalOpen && (
        <EditAddressModal
          editData={editData} 
          onClose={() => setEditModalOpen(false)}
          onSave={handleEditSave} 
          isUpdating={isUpdating} 
        />
      )}

      {addModalOpen && (
        <AddAddressForm
          onClose={() => setAddModalOpen(false)}
          onSubmit={handleAddSubmit} 
          isCreating={isCreating} 
        />
      )}
    </div>
  );
};

export default SavedAddress;