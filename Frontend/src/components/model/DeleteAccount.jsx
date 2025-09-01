import React, { useState } from "react";
import { ShieldAlert, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";

const DeleteAccount = ({ onClose }) => {
  const { DeleteAccount } = useAuthStore(); 
  const navigate = useNavigate();

  const confirmationText = "Delete my account";
  const [inputValue, setInputValue] = useState("");

  // ✅ React Query mutation for deleting account
  const mutation = useMutation({
    mutationFn: DeleteAccount,
    onSuccess: (data) => {
      toast.success(data.message || "Account deleted successfully");
      navigate("/"); 
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete account");
    },
  });

  const isButtonDisabled = inputValue !== confirmationText || mutation.isLoading;

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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative m-4 w-full max-w-md rounded-2xl bg-slate-50 shadow-2xl dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleDelete}>
          {/* --- Modal Header --- */}
          <div className="flex items-start gap-4 p-6">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
              <ShieldAlert
                className="h-7 w-7 text-red-600 dark:text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Delete Account
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                This action cannot be undone. This will permanently delete your
                account and all its data.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-800 dark:hover:bg-slate-700 dark:hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* --- Modal Body --- */}
          <div className="px-6 pb-6 space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              To confirm this action, please type the following phrase into the
              box below:
            </p>

            <div className="w-full text-center p-2 rounded-lg bg-slate-200 dark:bg-slate-800">
              <code className="font-mono font-medium text-slate-800 dark:text-slate-200 tracking-wider">
                {confirmationText}
              </code>
            </div>

            <input
              id="confirmation"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white dark:bg-slate-900 dark:border-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 dark:text-white"
              aria-label="Confirmation text input"
            />
          </div>

          {/* --- Modal Footer --- */}
          <div className="flex justify-end gap-4 px-6 py-4 bg-slate-100 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isButtonDisabled}
              className="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 transition-colors disabled:bg-red-300 dark:disabled:bg-red-900/50 disabled:cursor-not-allowed"
            >
              {mutation.isLoading ? "Deleting..." : "I understand, delete my account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccount;
