import React, { useState } from 'react';
import { Mail, Lock, User, Loader } from 'lucide-react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from "sonner";
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useAuthStore } from '../store/authStore';


const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const { registerUser, isLoading } = useAuthStore();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { name, email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await registerUser(email, name, password, confirmPassword);
      toast.success("Registration successful");
      navigate("/verify-email");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center bg-center h-screen w-full bg-gradient-to-br from-indigo-100 via-white to-indigo-50  px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white text-gray-700 max-w-lg w-full p-8 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Sign Up</h2>

        {/* Name */}
        <label htmlFor="name" className="font-medium block mb-1">Name</label>
        <div className="flex items-center border bg-indigo-500/5 border-gray-300 rounded gap-2 pl-3 my-2">
          <User size={18} />
          <input
            id="name"
            type="text"
            placeholder="Name"
            className="w-full py-2.5 outline-none bg-transparent"
            {...register("name", { required: "Name is required" })}
          />
        </div>
        {errors.name && <p className="text-red-500 text-sm mt-1 mb-4">{errors.name.message}</p>}

        {/* Email */}
        <label htmlFor="email" className="font-medium block mb-1">Email</label>
        <div className="flex items-center border bg-indigo-500/5 border-gray-300 rounded gap-2 pl-3 my-2">
          <Mail size={18} />
          <input
            id="email"
            type="email"
            placeholder="Email"
            className="w-full py-2.5 outline-none bg-transparent"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
          />
        </div>
        {errors.email && <p className="text-red-500 text-sm mt-1 mb-4">{errors.email.message}</p>}

        {/* Password */}
        <label htmlFor="password" className="font-medium block mb-1">Password</label>
        <div className="flex items-center border bg-indigo-500/5 border-gray-300 rounded gap-2 pl-3 pr-3 my-2">
          <Lock size={18} />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full py-2.5 outline-none bg-transparent"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 4,
                message: "Password must be at least 4 characters",
              },
            })}
          />
          <span onClick={() => setShowPassword(!showPassword)} className="cursor-pointer text-gray-600">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.password && <p className="text-red-500 text-sm mt-1 mb-4">{errors.password.message}</p>}

        {/* Confirm Password */}
        <label htmlFor="confirmPassword" className="font-medium block mb-1">Confirm Password</label>
        <div className="flex items-center border bg-indigo-500/5 border-gray-300 rounded gap-2 pl-3 pr-3 my-2">
          <Lock size={18} />
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            className="w-full py-2.5 outline-none bg-transparent"
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
          />
          <span onClick={() => setConfirmPassword(!showConfirmPassword)} className="cursor-pointer text-gray-600">
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1 mb-6">{errors.confirmPassword.message}</p>
        )}

        {/* Submit Button */}
 <button
  type="submit"
  disabled={isLoading}
  className="w-full bg-[#66659F] hover:bg-[#66659Fcc] transition-colors py-3 mt-4 rounded text-white font-semibold cursor-pointer flex justify-center items-center"
>
  {isLoading ? (
    <div className="flex items-center justify-center">
      <Loader className="w-6 h-6 animate-spin" />
    </div>
  ) : (
    "Sign Up"
  )}
</button>


        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
