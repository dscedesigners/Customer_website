import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaMapMarkerAlt, FaPhone, FaPlus } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import emptyCartImg from "../../assets/emptycart.jpg"; // Make sure this path is correct

// Import all necessary hooks
import { 
  useGetCartQuery, 
  useAddOrUpdateItemMutation, 
  useDeleteItemMutation 
} from "../../redux/services/cartSlice";
import { 
  useGetAddressesQuery, 
  useGetDefaultAddressQuery, 
  useSetDefaultAddressMutation, 
  useDeleteAddressMutation,
  useCreateAddressMutation,
  useUpdateAddressMutation
} from "../../redux/services/addressSlice";
import AddAddressForm from "../Profile/AddAddressForm";   
import EditAddressModal from "../Profile/EditAddressModal"; 

// INR formatter
const inr = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    n
  );

// ---------- Cart Page Component ----------
export default function Cart() {
  const navigate = useNavigate();

  // Fetch Cart Data
  const { data: cartData, isLoading: isCartLoading, refetch: refetchCart } = useGetCartQuery();
  
  // Local state to manage UI updates instantly for the debounce
  const [localCart, setLocalCart] = useState([]);
  
  // Fetch Address Data
  const { data: addressesData, isLoading: isAddressesLoading } = useGetAddressesQuery();
  const { data: defaultAddressData } = useGetDefaultAddressQuery();
  
  // Initialize Mutations
  const [addOrUpdateItem] = useAddOrUpdateItemMutation();
  const [deleteItem] = useDeleteItemMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();

  // Address State
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const addresses = addressesData?.addresses || [];
  
  // Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null); 
  const [openMenuFor, setOpenMenuFor] = useState(null); 

  // coupon
  const [coupon, setCoupon] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // --- Effects ---
  useEffect(() => {
    if (defaultAddressData?.address?.id) {
      setSelectedAddressId(defaultAddressData.address.id);
    } else if (addresses.length > 0) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [defaultAddressData, addresses]);

  useEffect(() => {
    if (cartData?.cartItems) {
      setLocalCart(cartData.cartItems);
    }
  }, [cartData]);

  // Debounce logic
  const debounceTimers = useRef({});
  const debouncedUpdate = useCallback((productId, quantity) => {
    if (debounceTimers.current[productId]) {
      clearTimeout(debounceTimers.current[productId]);
    }
    debounceTimers.current[productId] = setTimeout(() => {
      addOrUpdateItem({ productId, quantity })
        .unwrap()
        .catch(err => {
          console.error('Failed to update item:', err);
          refetchCart();
        });
      delete debounceTimers.current[productId];
    }, 3000); 
  }, [addOrUpdateItem, refetchCart]);

  // --- Cart actions ---
  const increaseQty = (productId) => {
    setLocalCart((items) =>
      items.map((it) => {
        if (it.productId === productId) {
          const newQuantity = it.quantity + 1;
          if (newQuantity > it.stock) return it;
          debouncedUpdate(productId, newQuantity); 
          return { ...it, quantity: newQuantity };
        }
        return it;
      })
    );
  };

  const decreaseQty = (productId) => {
    setLocalCart((items) =>
      items.map((it) => {
        if (it.productId === productId && it.quantity > 1) {
          const newQuantity = it.quantity - 1;
          debouncedUpdate(productId, newQuantity); 
          return { ...it, quantity: newQuantity };
        }
        return it;
      })
    );
  };

  const removeItem = (productId) => {
    setLocalCart((items) => items.filter((it) => it.productId !== productId));
    deleteItem(productId).unwrap().catch(err => {
      console.error('Failed to delete item:', err);
      refetchCart(); 
    });
  };

  // --- Address modal actions ---
  function openAddressModal() {
    setShowAddressModal(true);
  }
  function closeAddressModal() {
    setShowAddressModal(false);
    setOpenMenuFor(null);
  }

  function handleSetDefault(id) {
    setDefaultAddress(id); 
    setSelectedAddressId(id);
    setOpenMenuFor(null);
  }

  function handleDeleteAddress(id) {
    deleteAddress(id); 
    if (selectedAddressId === id) {
      const nextAddr = addresses.find((a) => a.id !== id);
      setSelectedAddressId(nextAddr ? nextAddr.id : null);
    }
    setOpenMenuFor(null);
  }

  function openAddAddress() {
    setShowAddressModal(false); 
    setAddModalOpen(true);      
  }

  function openEditAddress(address) {
    setEditData(address);         
    setShowAddressModal(false); 
    setEditModalOpen(true);     
    setOpenMenuFor(null);
  }

  function handleSelectAddress(id) {
    setSelectedAddressId(id);
  }

  const handleAddSubmit = async (formData) => {
    try {
      await createAddress(formData).unwrap();
      setAddModalOpen(false); 
    } catch (err) {
      console.error('Failed to add address:', err);
    }
  };

  const handleEditSave = async (updatedFormData) => {
    if (!editData?.id) return;
    try {
      await updateAddress({ id: editData.id, ...updatedFormData }).unwrap();
      setEditModalOpen(false);
      setEditData(null);
    } catch (err) {
      console.error('Failed to update address:', err);
    }
  };

  // --- Place Order Logic ---
  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    // 1. Refetch cart from backend for final stock check
    const { data: freshCartData } = await refetchCart();
    const freshItems = freshCartData?.cartItems || [];

    if (freshItems.length === 0) {
      alert('Your cart is empty.');
      setIsPlacingOrder(false);
      return;
    }

    // 2. Check for stock issues
    const stockIssues = freshItems.filter(i => i.stock === 0 || i.quantity > i.stock);

    if (stockIssues.length > 0) {
      const issueMessages = stockIssues.map(i => 
        i.stock === 0 
          ? `${i.name} is now out of stock.`
          : `${i.name} only has ${i.stock} items available (you have ${i.quantity}).`
      );
      alert(`Please fix issues in your cart:\n\n${issueMessages.join('\n')}`);
      setLocalCart(freshItems); // Sync local state with server
    } else {
      // 3. No issues, place order
      if (!selectedAddressId) {
        alert("Please select a shipping address before placing an order.");
        setIsPlacingOrder(false);
        return;
      }
      
      // --- FIX: Include selectedAddressId in the alert ---
      alert(`Order placed successfully for address: ${selectedAddressId}`);
      // TODO: Call createOrder mutation here
    }
    setIsPlacingOrder(false);
  };

  // --- 1. FRONTEND CALCULATION ---
  // We use useMemo to avoid recalculating on every render
  const { subtotal, calculatedTax, total } = useMemo(() => {
    // Only use items with stock > 0 for calculation
    const validItems = localCart.filter(item => item.stock > 0);
    
    // Calculate subtotal from local state
    const subtotal = validItems.reduce((acc, item) => {
      return acc + (item.price * item.quantity);
    }, 0);
    
    // Get tax rate from API (falls back to 0 if not loaded)
    const taxRate = cartData?.taxrate || 0;
    const calculatedTax = subtotal * (taxRate / 100);
    
    // Calculate total from local state
    const total = subtotal + calculatedTax;
    
    return { subtotal, calculatedTax, total };
  }, [localCart, cartData?.taxrate]); // Recalculate when localCart or taxrate changes

  // Loading state
  if (isCartLoading || isAddressesLoading) {
    return <div className="p-6 text-center">Loading cart...</div>;
  }

  // Empty cart UI
  if (localCart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* (empty cart JSX - no changes) */}
      </div>
    );
  }

  // Render main cart
  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-black hover:underline"
      >
        ← Continue Shopping
      </button>

      <h2 className="text-2xl font-semibold mb-2">Shopping Cart</h2>
      {/* This count is from the API, which is fine */}
      <p className="text-gray-500 mb-6">You have {cartData?.itemCount || 0} items in your cart</p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: items (no changes) */}
        <div className="lg:col-span-7 space-y-4">
          {localCart.map((item) => {
            const isOutOfStock = item.stock === 0;
            const isQuantityIssue = item.quantity > item.stock;
            const isUnavailable = isOutOfStock || isQuantityIssue;

            return (
              <div
                key={item.productId} 
                className={`relative rounded-xl border bg-white p-4 sm:p-5 ${
                  isUnavailable ? "border-red-300/80" : "hover:shadow-md"
                }`}
              >
                {isUnavailable && (
                  <div className="absolute left-4 -top-3 flex items-center gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-1 text-sm text-red-700">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1" />
                    </svg>
                    {isOutOfStock 
                      ? <span>Product Unavailable</span>
                      : <span>Only {item.stock} available</span>
                    }
                  </div>
                )}

                <div className="grid grid-cols-[88px_1fr_auto] gap-4 items-center">
                  <div className="aspect-[3/4] w-22 overflow-hidden rounded-xl bg-gray-100">
                    <img src={item.thumbnail} alt={item.name} className="h-full w-full object-cover" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold leading-tight">{item.name}</h3>
                    <p className="text-sm text-gray-600">Size : {item.size}</p>
                    <p className="text-sm text-gray-600">Color : {item.color}</p>
                    <p className="pt-1 font-semibold">{inr(item.price)}</p>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <button
                      onClick={() => removeItem(item.productId)}
                      aria-label="Remove item"
                      className="text-black"
                    >
                      <FaTrash />
                    </button>

                    <div className="inline-flex items-center rounded-lg border border-black bg-white">
                      <button
                        onClick={() => decreaseQty(item.productId)}
                        disabled={isOutOfStock || item.quantity <= 1}
                        className="h-9 w-9 flex items-center justify-center text-black font-bold disabled:opacity-50"
                      >
                        -
                      </button>
                      <div className="px-3 text-sm font-medium tabular-nums">{item.quantity}</div>
                      <button
                        onClick={() => increaseQty(item.productId)}
                        disabled={isOutOfStock || item.quantity >= item.stock}
                        className="h-9 w-9 flex items-center justify-center text-black font-bold disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Shipping Details Card (no changes) */}
          <div className="rounded-2xl border p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Shipping Details</h3>
              <button
                onClick={openAddressModal}
                className="px-3 py-1 border rounded-full text-sm hover:bg-gray-100"
              >
                Change
              </button>
            </div>
            <div className="mt-3 text-sm space-y-2">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-0.5 text-black" />
                <p>
                  {addresses.find((a) => a.id === selectedAddressId)?.street ??
                    "No address selected"}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <FaPhone className="mt-0.5 text-black" />
                <p>{addresses.find((a) => a.id === selectedAddressId)?.contactPhone ?? ""}</p>
              </div>
            </div>
          </div>

          {/* Shipping Method card (Commented out) */}
          {/*
          <div className="rounded-2xl border p-4">
            ...
          </div>
          */}

          {/* Summary card */}
          <div className="rounded-2xl border p-4 space-y-4">
            <h3 className="text-lg font-semibold">Summary</h3>

            {/* --- 2. USE FRONTEND CALCULATIONS --- */}
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{inr(subtotal)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Tax ({cartData?.taxrate || 0}%)</span>
              <span>{inr(calculatedTax)}</span>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Coupon</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1 border rounded px-3 py-2"
                />
                <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                  Apply
                </button>
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{inr(total)}</span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 disabled:opacity-50"
            >
              {isPlacingOrder ? "Placing order..." : "Place order"}
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- Address Selection Modal ---------------- */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeAddressModal} />
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Select Address</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={openAddAddress}
                  className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded"
                >
                  <FaPlus /> Add New
                </button>
                <button onClick={closeAddressModal} className="p-2">
                  <AiOutlineClose />
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-72 overflow-auto pr-2">
              {addresses.map((a) => (
                  <div
                    key={a.id}
                    className={`flex items-start justify-between gap-3 p-3 rounded border ${
                      selectedAddressId === a.id ? "border-black bg-gray-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="selectedAddress"
                        checked={selectedAddressId === a.id}
                        onChange={() => handleSelectAddress(a.id)}
                        className="mt-1"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <strong>{a.fullName}</strong>
                          {a.isDefault && <span className="text-xs px-2 py-0.5 rounded border">Default</span>}
                        </div>
                        <div className="text-sm text-gray-600">{a.street}, {a.city}</div>
                        <div className="text-sm text-gray-500">{a.contactPhone}</div>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuFor(openMenuFor === a.id ? null : a.id)}
                        className="p-2"
                      >
                        <FiMoreVertical />
                      </button>

                      {openMenuFor === a.id && (
                        <div className="absolute right-0 top-8 w-44 bg-white border rounded shadow z-10">
                          {!a.isDefault && (
                            <button
                              onClick={() => handleSetDefault(a.id)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50"
                            >
                              Set as default
                            </button>
                          )}
                          <button
                            onClick={() => openEditAddress(a)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50"
                          >
                            Edit address
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(a.id)}
                            className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-50"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button onClick={closeAddressModal} className="px-4 py-2 border rounded">Cancel</button>
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Use selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Render the Add/Edit Modals --- */}
      {addModalOpen && (
        <AddAddressForm
          onClose={() => setAddModalOpen(false)}
          onSubmit={handleAddSubmit}
          isCreating={isCreating}
        />
      )}

      {editModalOpen && (
        <EditAddressModal
          editData={editData}
          onClose={() => {
            setEditModalOpen(false);
            setEditData(null); 
          }}
          onSave={handleEditSave}
          isUpdating={isUpdating}
        />
      )}
      
    </div>
  );
}