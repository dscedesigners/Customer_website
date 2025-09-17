import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../redux/feauters/authSlice'; // 1. Import the logOut action
import Sidebar from './Sidebar';
import ProfileInfo from './ProfileInfo';
import Orders from './Orders';
import Address from './Address';

const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState('profileInfo');
  const navigate = useNavigate();
  const dispatch = useDispatch(); // 2. Initialize dispatch

  // 3. Implement the full logout logic
  const handleLogout = () => {
    dispatch(logOut()); // Clears user from Redux state and local storage
    navigate('/login'); // Redirect to login page
  };

  // Helper to get the title for the header
  const getSectionTitle = () => {
    switch (activeSection) {
      case 'profileInfo':
        return 'My Profile';
      case 'orders':
        return 'My Orders';
      case 'address':
        return 'Manage Addresses';
      default:
        return 'My Profile';
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profileInfo':
        return <ProfileInfo />;
      case 'orders':
        return <Orders />;
      case 'address':
        return <Address />;
      default:
        return <ProfileInfo />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex">
      {/* The Sidebar component remains unchanged */}
      <Sidebar setActiveSection={setActiveSection} handleLogout={handleLogout} />
      
      {/* 4. Main content area with a new header and cleaner layout */}
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {getSectionTitle()}
            </h1>
          </header>
          
          {/* Renders the active component (ProfileInfo, Orders, Address) */}
          <div>
            {renderSection()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;