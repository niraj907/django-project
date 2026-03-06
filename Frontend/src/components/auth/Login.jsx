import React, { useState } from 'react';
import { Mail, Lock, Loader } from 'lucide-react';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { toast } from "sonner";
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useAuthStore } from '../store/authStore';
import { useGoogleLogin } from '@react-oauth/google';


const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, googleLogin, isLoading } = useAuthStore();

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const idToken = tokenResponse.access_token; // Note: for OAuth2 it's access_token, for ID token it depends on response type
      await googleLogin(idToken);
      toast.success("Google Login successful");
      navigate("/dashboard");
    } catch (err) {
      const errorData = err.response?.data?.errors || err.response?.data?.error;
      let errorMsg = "Google login failed";
      if (errorData) {
        const firstKey = Object.keys(errorData)[0];
        if (firstKey && Array.isArray(errorData[firstKey])) {
          errorMsg = errorData[firstKey][0];
        } else if (firstKey) {
          errorMsg = JSON.stringify(errorData[firstKey]);
        }
      }
      toast.error(errorMsg);
    }
  };

  const googleLoginHandler = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error("Google Login Failed"),
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      console.log("Login Form Data:", data); // { email: "user@example.com", password: "123456" }
      console.log("Email:", data.email);
      console.log("Password:", data.password);

      await login(data.email, data.password);
      toast.success("Login successful ");
      navigate("/dashboard");
    } catch (err) {
      const errorData = err.response?.data?.errors || err.response?.data?.error;
      let errorMsg = "Login failed";
      if (errorData) {
        const firstKey = Object.keys(errorData)[0];
        if (firstKey && Array.isArray(errorData[firstKey])) {
          errorMsg = errorData[firstKey][0];
        } else if (firstKey) {
          errorMsg = JSON.stringify(errorData[firstKey]);
        }
      }
      toast.error(errorMsg);
    }
  };

  // console.log(data)

  return (
    <div className="flex items-center justify-center bg-center h-screen w-full bg-gradient-to-br from-indigo-100 via-white to-indigo-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white text-gray-700 max-w-lg w-full p-8 rounded-xl shadow-lg"

      >
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Welcome Back</h2>

        {/* Email Input */}
        <label htmlFor="email" className="font-medium block mb-1">Email</label>
        <div className="flex items-center mb-4 border bg-indigo-500/5 border-gray-300 rounded gap-2 pl-3">
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
                message: "Enter a valid email address"
              }
            })}
          />
        </div>
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        {/* Password Input */}
        <label htmlFor="password" className="font-medium block mb-1">Password</label>
        <div className="flex items-center mb-6 border bg-indigo-500/5 border-gray-300 rounded gap-2 pl-3 pr-3">
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
                message: "Password must be at least 4 characters long"
              }
            })}
          />
          <span onClick={() => setShowPassword(!showPassword)} className="cursor-pointer text-gray-600">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1">
            <input type="checkbox" id="checkbox" />
            <label htmlFor="checkbox">Remember me</label>
          </div>
          <p className="text-blue-600">
            <Link to="/forgot-password" className="text-blue-500">
              Forgot Password
            </Link>
          </p>
        </div>



        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#66659F] hover:bg-[#66659Fcc] transition-colors py-3 rounded text-white font-semibold cursor-pointer"
        >
          {isLoading ? <Loader className='w-6 h-6 animate-spin mx-auto' /> : "Login"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Sign-in Button */}
        <button
          onClick={() => googleLoginHandler()}
          disabled={isLoading}
          type="button"
          className="w-full flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-50 transition-colors py-2.5 rounded text-gray-700 font-semibold cursor-pointer disabled:opacity-50"
        >
          <FaGoogle className='mr-2 text-red-500' /> Sign in with Google
        </button>

        <p className="text-center mt-4">Don't have an account? <Link to={'/signup'} className="text-blue-500">signup</Link></p>
      </form>
    </div>
  );
};

export default LoginPage;
