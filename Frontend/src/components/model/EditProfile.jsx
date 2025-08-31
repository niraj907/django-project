import React, { useState } from "react";
import { X, Camera } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { toast } from "sonner"

const EditProfile = ({ user, onClose }) => {
  const { updateProfile, isLoading, error } = useAuthStore();

  // Initialize form data with user data
  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    phone_number: user?.phone_number || "",
    permanent_address: user?.permanent_address || "",
  });

  const [preview, setPreview] = useState(user?.image || null); // for preview
  const [selectedFile, setSelectedFile] = useState(null); // for upload

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const profileData = {
        ...formData,
        image: selectedFile, // file object
      };

      await updateProfile(profileData);

      toast.success("Profile updated successfully!");
      onClose();
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60"
    >
      <div
        className="relative mx-4 w-full max-w-3xl rounded-2xl bg-slate-50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- Modal Header --- */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
            <p className="text-sm text-gray-500 mt-1">
              Update your photo and personal details.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* --- Modal Body & Form --- */}
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* --- Profile Picture Section --- */}
              <div className="flex flex-col items-center md:items-start">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo
                </label>
                <div className="relative group">
                <img
  src={
    preview ||
    `https://ui-avatars.com/api/?name=${user?.name || "A"}&background=random&size=128`
  }
  alt={user?.name ? user.name.charAt(0).toUpperCase() : "A"}
  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
/>

                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="text-white" size={32} />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* --- Form Fields Section --- */}
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border rounded-md"
                      placeholder="Your full name"
                    />
                  </div>

                  {/* Username Input */}
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border rounded-md"
                      placeholder="Your username"
                    />
                  </div>

                  {/* Permanent Address */}
                  <div>
                    <label
                       htmlFor="permanent_address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Permanent Address
                    </label>
                      <input
                      type="text"
                      id="permanent_address"
                      name="permanent_address"
                      value={formData.permanent_address}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border rounded-md"
                      placeholder="Your permanent address"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor="phone_number"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Mobile No
                    </label>
                    <input
                      type="text"
                      id="phone_number"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border rounded-md"
                      placeholder="Enter mobile number"
                    />
                  </div>

                
                  {/* Email Input (read-only) */}
                  <div className="sm:col-span-2">
                    <label
                       htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                          Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="mt-1 block w-full px-3 py-2 border rounded-md bg-gray-100"
                    />

                  </div>


                </div>
              </div>
            </div>
          </div>

          {/* --- Modal Footer --- */}
          <div className="flex justify-end gap-4 p-6 bg-gray-100 border-t border-slate-200 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white rounded-lg border hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
