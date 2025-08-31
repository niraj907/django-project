import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Lock, X } from 'lucide-react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Setting = ({ onClose }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    mode: 'onBlur', // Validate fields when they lose focus
  });

  // State for toggling password visibility independently
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // A placeholder function for form submission
  const onSubmit = (data) => {
    console.log("Form data submitted:", data);
    onClose(); // Close modal on successful submission
  };
  
  // Watch the newPassword field to validate confirmPassword
  const newPassword = watch("newPassword");

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60"
      onClick={onClose} // Close modal when clicking on the overlay
    >
      <div
        className="relative m-4 w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
      >
        {/* --- Modal Header --- */}
        <div className="flex items-start justify-between p-5 border-b border-gray-200 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
            <p className="text-sm text-gray-500 mt-1">For security, please do not share your password.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-800 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* --- Modal Body --- */}
          <div className="p-6 space-y-6">
            {/* Old Password Input */}
            <div>
              <label htmlFor="oldPassword" className="text-sm font-medium text-gray-700 block mb-2">Old Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="oldPassword"
                  type={showOldPassword ? 'text' : 'password'}
                  placeholder="Enter your current password"
                  className={`w-full py-2.5 pl-10 pr-10 border rounded-lg outline-none transition-colors ${errors.oldPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} focus:ring-2`}
                  {...register("oldPassword", {
                    required: "Old Password is required"
                  })}
                />
                <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800">
                  {showOldPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              {errors.oldPassword && <p className="text-red-500 text-xs mt-1">{errors.oldPassword.message}</p>}
            </div>

            {/* New Password Input */}
            <div>
              <label htmlFor="newPassword" className="text-sm font-medium text-gray-700 block mb-2">New Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter your new password"
                  className={`w-full py-2.5 pl-10 pr-10 border rounded-lg outline-none transition-colors ${errors.newPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} focus:ring-2`}
                  {...register("newPassword", {
                    required: "New Password is required",
                    minLength: { value: 8, message: "Password must be at least 8 characters long" }
                  })}
                />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800">
                  {showNewPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
            </div>

            {/* Confirm New Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block mb-2">Confirm New Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your new password"
                  className={`w-full py-2.5 pl-10 pr-10 border rounded-lg outline-none transition-colors ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} focus:ring-2`}
                  {...register("confirmPassword", {
                    required: "Please confirm your new password",
                    validate: value => value === newPassword || "Passwords do not match"
                  })}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800">
                  {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {/* --- Modal Footer --- */}
          <div className="flex justify-end gap-3 p-5 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Setting;