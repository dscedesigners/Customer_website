import React from 'react';
import { useSelector } from 'react-redux';

const ProfileInfo = () => {
  // Get the user information directly from the Redux auth state
  const { user } = useSelector((state) => state.auth);

  // If there's no user in the state (e.g., not logged in), show a message.
  if (!user) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold text-gray-700">Please log in to view your profile.</h2>
      </div>
    );
  }

  // Display the user's information
  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-4 mb-6">My Profile</h2>
      <div className="space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-500 mb-1">Full Name</label>
          <p className="text-lg text-gray-900">{user.name}</p>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-500 mb-1">Email Address</label>
          <p className="text-lg text-gray-900">{user.email}</p>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-500 mb-1">Phone Number</label>
          <p className="text-lg text-gray-900">{user.phone || 'Not provided'}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;