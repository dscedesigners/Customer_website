import React, { useEffect, useState } from "react";
import { useUpdateUserMutation, useGetUserByIdQuery } from "../../redux/services/userSlice";
import { useSelector } from "react-redux";

const ProfileInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    img: null,
    image:"" // Store file object
  });

  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?.user?.phone; // Correct user ID

  const { data: User, isLoading, refetch } = useGetUserByIdQuery({ userId });

  useEffect(() => {
    if (User) {
      setProfile({
        name: User?.name || "",
        email: User?.email || "",
        img: User?.image || "",
        image:User?.image // Keep existing image URL
      });
    }
  }, [User]);

  const [updateUser] = useUpdateUserMutation();

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("email", profile.email);

    if (profile.img && typeof profile.img !== "string") {
      formData.append("img", profile.img); // Append file only if new image is selected
    }

    try {
      const res = await updateUser({ userId: userInfo?.user?.id, data: formData }).unwrap();
      console.log(res);
      setIsEditing(false);
      refetch(); // Refresh data after update
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleChange = (e, field) => {
    setProfile({
      ...profile,
      [field]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile({
        ...profile,
        img: file,
        image:imageUrl // Store file object
      });
    }
  };

  return (
    <div className="bg-sky-100 text-gray-700 p-8">
      <div className="container mx-auto px-10 space-y-8">
        {/* Profile Image */}
        
        <div className="flex justify-center">
          <img
            src={profile?.image}
            alt="Profile"
            className="w-32 h-32 rounded-full border border-gray-300"
          />
          
          <h1>{User?.phone}</h1>
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-gray-600"
            />
          )}
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-black">Profile Info</h2>

          <input
            type="text"
            value={profile.name}
            onChange={(e) => handleChange(e, "name")}
            readOnly={!isEditing}
            placeholder="Name"
            className={`p-3 w-full rounded-lg border ${
              isEditing ? "border-gray-600" : "bg-gray-200"
            }`}
          />

          <input
            type="email"
            value={profile.email}
            onChange={(e) => handleChange(e, "email")}
            readOnly={!isEditing}
            placeholder="Email"
            className={`p-3 w-full rounded-lg border ${
              isEditing ? "border-gray-600" : "bg-gray-200"
            }`}
          />

          {/* Edit / Save Button */}
          <div className="flex space-x-4">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="text-green-500 hover:text-green-700"
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
