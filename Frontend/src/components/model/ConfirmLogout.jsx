import React from 'react';
import { X } from 'lucide-react';
import { MdLogout } from 'react-icons/md';

const ConfirmLogout = ({ onClose, onConfirm,  message }) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 flex items-center justify-center bg-black/50
 bg-opacity-50 z-[70]"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute  rounded-full top-4 right-4 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors p-2"
          onClick={onClose}
        >
          <X />
        </button>

        {/* Logout Icon inside circle */}
        <div className="flex justify-center">
          <div className="bg-[#66659F73] p-3 rounded-full">
            <MdLogout className="text-[#66659F] w-8 h-8" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-lg font-semibold mt-4">Confirm Logout</h2>

        {/* Message */}
        <p className="text-center mt-2 text-gray-600">{message}</p>

        {/* Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            className="px-5 py-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 text-sm font-medium text-white bg-[#66659F] rounded-lg hover:bg-[#66659F73] transition"
           onClick={onConfirm}
          
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogout;
