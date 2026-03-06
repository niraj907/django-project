import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Lock, X } from 'lucide-react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

const getApiErrorMessage = (error, fallback) => {
  const data = error?.response?.data;

  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (typeof data?.message === "string") return data.message;

  const firstFieldError = Object.values(data).find(
    (value) => typeof value === "string" || (Array.isArray(value) && value.length > 0)
  );

  if (typeof firstFieldError === "string") return firstFieldError;
  if (Array.isArray(firstFieldError)) return firstFieldError[0];

  return fallback;
};

const Setting = ({ onClose }) => {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({
    mode: 'onBlur',
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { changePassword, isLoading } = useAuthStore();
  const newPassword = watch("newPassword");

  const onSubmit = async (data) => {
    try {
      await changePassword(data.oldPassword, data.newPassword, data.confirmPassword);
      toast.success("Password updated successfully!");
      reset(); // Reset form after successful update
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Old password is incorrect"));
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4"
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-8 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-outfit">Change Password</h2>
            <p className="text-sm text-gray-500 mt-1 font-outfit">Keep your account secure with a strong password.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all font-outfit"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-8 space-y-6">
            {/* Old Password */}
            <div>
              <label htmlFor="oldPassword" className="text-sm font-bold text-gray-700 font-outfit block mb-2">
                Old Password
              </label>
              <div className="relative flex items-center group">
                <Lock className="absolute left-4 text-gray-400 transition-colors group-focus-within:text-indigo-600" size={18} />
                <input
                  id="oldPassword"
                  type={showOldPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full py-3.5 pl-12 pr-12 bg-gray-50 border border-gray-100 rounded-xl outline-none transition-all font-outfit ${
                    errors.oldPassword 
                    ? 'border-red-400 focus:ring-4 focus:ring-red-600/5' 
                    : 'focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5'
                  }`}
                  {...register("oldPassword", { required: "Old Password is required" })}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-4 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  {showOldPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              {errors.oldPassword && <p className="text-red-500 text-xs mt-1 font-bold font-outfit">{errors.oldPassword.message}</p>}
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="text-sm font-bold text-gray-700 font-outfit block mb-2">
                New Password
              </label>
              <div className="relative flex items-center group">
                <Lock className="absolute left-4 text-gray-400 transition-colors group-focus-within:text-indigo-600" size={18} />
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full py-3.5 pl-12 pr-12 bg-gray-50 border border-gray-100 rounded-xl outline-none transition-all font-outfit ${
                    errors.newPassword 
                    ? 'border-red-400 focus:ring-4 focus:ring-red-600/5' 
                    : 'focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5'
                  }`}
                  {...register("newPassword", {
                    required: "New Password is required",
                    minLength: { value: 8, message: "At least 8 characters required" },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  {showNewPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              {errors.newPassword && <p className="text-red-500 text-xs mt-1 font-bold font-outfit">{errors.newPassword.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="text-sm font-bold text-gray-700 font-outfit block mb-2">
                Confirm New Password
              </label>
              <div className="relative flex items-center group">
                <Lock className="absolute left-4 text-gray-400 transition-colors group-focus-within:text-indigo-600" size={18} />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full py-3.5 pl-12 pr-12 bg-gray-50 border border-gray-100 rounded-xl outline-none transition-all font-outfit ${
                    errors.confirmPassword 
                    ? 'border-red-400 focus:ring-4 focus:ring-red-600/5' 
                    : 'focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5'
                  }`}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: value => value === newPassword || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-bold font-outfit">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {/* Modal Footer */}
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
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Setting;
