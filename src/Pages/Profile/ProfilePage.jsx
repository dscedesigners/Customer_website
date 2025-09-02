import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ProfileInfo from './ProfileInfo';
import Orders from './Orders';
import Address from './Address';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState('profileInfo');
  const navigate = useNavigate();

  
  const handleLogout = () => {
    // Clear authentication tokens, etc.
    
    navigate('/account'); // Redirect to login page after logout
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
    <div className="bg-sky-100 min-h-screen">
      <div className="flex">
        <Sidebar setActiveSection={setActiveSection} handleLogout={handleLogout} />
        <div className="ml-64 p-8 w-full">{renderSection()}</div>
      </div>
    </div>
  );
};

export default ProfilePage;
