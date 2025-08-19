import React from "react";
import { Mail, ArrowLeft,Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuthStore } from "../store/authStore";


const ForgotPassword = () => {
  const { forgotPassword, isLoading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email);
      toast.success("Reset link sent successfully!");
      reset({email: ""});
    } catch (err) {
      toast.error(error || "Email not found. Please enter a registered email.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50 px-4">
      <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-xl space-y-6 animate-fadeIn">
        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Forgot your password?</h1>
          <p className="text-[#66659F] text-sm leading-relaxed">
            Don’t worry! Just enter your email address below, and we’ll send you
            instructions to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <label htmlFor="email" className="font-medium block mb-2 text-gray-700">
            Email Address
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-400">
            <span className="pl-3 text-gray-500">
              <Mail size={18} />
            </span>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full py-2.5 px-3 outline-none bg-transparent text-gray-700"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address"
                }
              })}
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          {/* Reset Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#66659F] hover:bg-[#55548F] transition-colors py-3 rounded-lg text-white font-semibold shadow-sm hover:shadow-md disabled:opacity-50"
          >
          

                 {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Reset Password"}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-sm text-[#66659F] hover:underline">
            <ArrowLeft size={16} className="mr-1" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
