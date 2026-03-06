import React, { useState } from "react";
import { ShieldAlert, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";

const DeleteAccount = ({ onClose }) => {
  const { DeleteAccount: deleteAccount } = useAuthStore();
  const navigate = useNavigate();

  const confirmationText = "Delete my account";
  const [inputValue, setInputValue] = useState("");

  // ✅ React Query mutation for deleting account
  const mutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: (data) => {
      toast.success(data.message || "Account deleted successfully");
      navigate("/");
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete account");
    },
  });

  const isButtonDisabled = inputValue !== confirmationText || mutation.isPending;

  const handleDelete = (e) => {
    e.preventDefault();
    if (!isButtonDisabled) {
      mutation.mutate();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4"
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleDelete}>
          {/* --- Modal Header --- */}
          <div className="flex items-start gap-4 p-8">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-red-50">
              <ShieldAlert
                className="h-7 w-7 text-red-600"
                aria-hidden="true"
              />
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-gray-900 font-outfit">
                Delete Account
              </h2>
              <p className="mt-1 text-sm text-gray-500 font-outfit">
                This action is permanent and cannot be undone. All your data will be removed.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* --- Modal Body --- */}
          <div className="px-8 pb-8 space-y-5">
            <p className="text-sm font-medium text-gray-600 font-outfit">
              To confirm, please type the phrase below:
            </p>

            <div className="w-full text-center py-4 bg-gray-50 rounded-2xl border border-gray-100 italic">
              <code className="font-mono font-bold text-gray-800 tracking-wider">
                {confirmationText}
              </code>
            </div>

            <input
              id="confirmation"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type the phrase here..."
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-red-500 focus:ring-4 focus:ring-red-600/5 transition-all font-outfit text-gray-900"
              aria-label="Confirmation text input"
            />
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
              disabled={isButtonDisabled}
              className="px-6 py-3 text-sm font-bold text-white bg-red-600 rounded-xl shadow-lg shadow-red-600/20 hover:bg-red-700 disabled:opacity-50 transition-all font-outfit"
            >
              {mutation.isPending ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccount;
