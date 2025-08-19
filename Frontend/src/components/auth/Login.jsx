import React, { useState } from 'react';
import { Mail, Lock ,Loader} from 'lucide-react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from "sonner";
import { data, Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useAuthStore } from '../store/authStore';


const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
    const { login, isLoading, error } = useAuthStore();

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
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  // console.log(data)

  return (
    <div className="flex items-center justify-center bg-center h-screen w-full bg-gradient-to-br from-indigo-100 via-white to-indigo-50 px-4">
      <form
          onSubmit={handleSubmit(onSubmit)}
        className="bg-white text-gray-700 max-w-lg w-full p-8 rounded-xl shadow-lg"
        
      >
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Login</h2>

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

        <p className="text-center mt-4">Don't have an account? <Link to={'/signup'} className="text-blue-500">signup</Link></p>
      </form>
    </div>
  );
};

export default LoginPage;
