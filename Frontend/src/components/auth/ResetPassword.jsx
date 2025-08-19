import React, { useState } from 'react';
import { Lock, Loader } from 'lucide-react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom"; 
import { useAuthStore } from '../store/authStore';

const ResetPassword = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 const navigate = useNavigate();


  const { resetPassword, isLoading } = useAuthStore();

  // Get uid and token from route params
  const { uid, token } = useParams();

  const onSubmit = async (data) => {
    try {
      await resetPassword(uid, token, data.password, data.confirmPassword);
      toast.success("Password reset successfully.");
       navigate("/"); 
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error resetting password");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full bg-gradient-to-br from-indigo-100 via-white to-indigo-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white text-gray-700 max-w-lg w-full p-8 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Reset Password</h2>

        {/* Password Input */}
        <label htmlFor="password" className="font-medium block mb-1">Password</label>
        <div className="flex items-center mb-2 border bg-indigo-500/5 border-gray-300 rounded gap-2 pl-3 pr-3">
          <Lock size={18} />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full py-2.5 outline-none bg-transparent"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 4, message: "Password must be at least 4 characters long" }
            })}
          />
          <span onClick={() => setShowPassword(!showPassword)} className="cursor-pointer text-gray-600">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.password && <p className="text-red-500 text-sm mb-4">{errors.password.message}</p>}

        {/* Confirm Password Input */}
        <label htmlFor="confirmPassword" className="font-medium block mb-1">Confirm Password</label>
        <div className="flex items-center mb-2 border bg-indigo-500/5 border-gray-300 rounded gap-2 pl-3 pr-3">
          <Lock size={18} />
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            className="w-full py-2.5 outline-none bg-transparent"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value) => value === watch("password") || "Passwords do not match"
            })}
          />
          <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="cursor-pointer text-gray-600">
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-sm mb-4">{errors.confirmPassword.message}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#66659F] hover:bg-[#66659Fcc] transition-colors py-3 my-4 rounded text-white font-semibold cursor-pointer"
        >
          {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Set New Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
