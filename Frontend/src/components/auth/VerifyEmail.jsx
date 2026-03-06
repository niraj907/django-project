import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../store/authStore";

const VerifyEmail = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { verifyEmail, resendOTP } = useAuthStore();
  const [timer, setTimer] = useState(0);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    try {
      await resendOTP();
      toast.success("A new OTP has been sent to your email.");
      setTimer(60); // 60-second cooldown
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to resend OTP. Please try again."
      );
    }
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).replace(/\D/g, "").split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      const focusIndex = newCode.findIndex((digit) => digit === "") || 5;
      inputRefs.current[focusIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newCode = Array(6).fill("");

    pasted.split("").forEach((char, i) => {
      newCode[i] = char;
    });

    setCode(newCode);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (code.some((digit) => digit === "")) {
      toast.error("Please fill in all the fields.");
      return;
    }

    const verificationCode = code.join("");

    try {
      await verifyEmail(verificationCode);
      toast.success("Email verified successfully");
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong during email verification!"
      );
    }
  };

  return (
    <div className="flex items-center justify-center bg-center h-screen w-full bg-gradient-to-br from-indigo-100 via-white to-indigo-50 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg space-y-6 animate-fadeIn">
        <h1 className="text-3xl font-bold text-center text-gray-800">Verify Your Email</h1>
        <p className="text-center text-[#66659F] text-sm">
          Enter the 6-digit code sent to your email address.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66659F] transition-all duration-150"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#66659F] text-white text-sm font-semibold rounded-lg hover:bg-[#66659Fcc] transition duration-200 cursor-pointer"
          >
            Verify Email
          </button>
        </form>

        <p className="text-xs text-center text-gray-400">
          Didn't receive a code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={timer > 0}
            className={`font-semibold ${timer > 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-[#66659F] hover:underline cursor-pointer"
              }`}
          >
            {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
