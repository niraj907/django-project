import React from 'react';
import { X } from 'lucide-react';

const Confirm = ({ 
  onClose, 
  onConfirm, 
  title, 
  message, 
  buttonText, 
  Icon, 
  buttonColor,
  iconBgColor,
  iconColor
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 flex items-center justify-center bg-black/60 z-[70] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute rounded-full top-4 right-4 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors p-2"
          onClick={onClose}
        >
          <X />
        </button>

        {/* Icon inside circle */}
        {Icon && (
          <div className="flex justify-center">
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: iconBgColor }}
            >
              <Icon className="w-8 h-8" style={{ color: iconColor }} />
            </div>
          </div>
        )}

        {/* Title */}
        <h2 className="text-center text-lg font-semibold mt-4">{title}</h2>

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
            className={`px-5 py-2 text-sm font-medium text-white rounded-lg transition`}
            style={{ backgroundColor: buttonColor }}
            onClick={onConfirm}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
