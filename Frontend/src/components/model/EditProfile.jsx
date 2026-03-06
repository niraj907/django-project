import React, { useEffect, useState } from "react";
import { X, Camera } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { toast } from "sonner";


const API_DOMAIN = import.meta.env.VITE_API_DOMAIN || "http://127.0.0.1:8000";

const EditProfile = ({ user, onClose }) => {
  const { updateProfile, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    phone_number: user?.phone_number || "",
    permanent_address: user?.permanent_address || "",
  });

  const [preview, setPreview] = useState(user?.image || null);
  const [selectedFile, setSelectedFile] = useState(null);

  // ✅ 2. Make the function more robust to handle non-string values
  const getImageUrl = (imagePath) => {
    if (typeof imagePath !== "string" || !imagePath) {
      return null;
    }

    if (
      imagePath.startsWith("blob:") ||
      imagePath.startsWith("data:") ||
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    return imagePath.startsWith("/")
      ? `${API_DOMAIN}${imagePath}`
      : `${API_DOMAIN}/${imagePath}`;
  };

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

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
      const objectUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreview((prev) => {
        if (prev?.startsWith("blob:")) {
          URL.revokeObjectURL(prev);
        }
        return objectUrl;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const profileData = {
        ...formData,
        // Only include the image if a new one was selected
        ...(selectedFile && { image: selectedFile }),
      };

      await updateProfile(profileData);

      toast.success("Profile updated successfully!");
      onClose();
    } catch (err) {
      console.error("Error updating profile:", err);

      // Extract error message from the backend response
      const serverError = err.response?.data;
      if (serverError && typeof serverError === "object") {
        // Handle field-specific errors
        const firstKey = Object.keys(serverError)[0];
        const errorMsg = Array.isArray(serverError[firstKey])
          ? serverError[firstKey][0]
          : serverError[firstKey];

        toast.error(`${firstKey.replace("_", " ")}: ${errorMsg}`);
      } else {
        toast.error("Failed to update profile. Please check your details and try again.");
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4"
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- Modal Header --- */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-outfit">Edit Profile</h2>
            <p className="text-sm text-gray-500 mt-1 font-outfit">
              Update your photo and personal information.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all font-outfit"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* --- Modal Body & Form --- */}
        <form onSubmit={handleSubmit}>
          <div className="p-8">
            <div className="space-y-8">
              {/* --- Profile Picture Section --- */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-3xl bg-indigo-50 border-4 border-white shadow-xl overflow-hidden">
                    <img
                      src={
                        getImageUrl(preview) ||
                        `https://ui-avatars.com/api/?name=${user?.name || "A"}&background=4f46e5&color=fff&size=128`
                      }
                      alt="Profile"
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute -bottom-2 -right-2 p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg cursor-pointer hover:bg-indigo-700 transition-all hover:scale-110"
                  >
                    <Camera size={18} />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <p className="mt-3 text-xs font-bold text-gray-400 uppercase tracking-widest font-outfit">Profile Photo</p>
              </div>

              {/* --- Form Fields Section --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="text-sm font-bold text-gray-700 font-outfit block mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none font-outfit"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="username" className="text-sm font-bold text-gray-700 font-outfit block mb-2">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none font-outfit"
                    placeholder="johndoe"
                  />
                </div>

                <div>
                  <label htmlFor="permanent_address" className="text-sm font-bold text-gray-700 font-outfit block mb-2">Permanent Address</label>
                  <input
                    type="text"
                    id="permanent_address"
                    name="permanent_address"
                    value={formData.permanent_address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none font-outfit"
                    placeholder="New York, USA"
                  />
                </div>

                <div>
                  <label htmlFor="phone_number" className="text-sm font-bold text-gray-700 font-outfit block mb-2">Mobile No</label>
                  <input
                    type="text"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    maxLength={10}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none font-outfit"
                    placeholder="98XXXXXXXX"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="email" className="text-sm font-bold text-gray-700 font-outfit block mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-100 rounded-xl text-gray-500 font-outfit cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --- Modal Footer --- */}
          <div className="flex justify-end gap-3 p-8 bg-gray-50 border-t border-gray-100 rounded-b-3xl">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-outfit"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50 transition-all font-outfit"
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
