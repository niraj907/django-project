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
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4"
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl p-8 overflow-y-auto max-h-[90vh] custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all font-outfit"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Icon Section */}
        {Icon && (
          <div className="flex justify-center mb-6">
            <div
              className="p-5 rounded-2xl shadow-lg"
              style={{ backgroundColor: iconBgColor || '#f3f4f6' }}
            >
              <Icon className="w-8 h-8" style={{ color: iconColor || '#374151' }} />
            </div>
          </div>
        )}

        {/* Text Content */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 font-outfit tracking-tight">{title}</h2>
          <p className="mt-3 text-gray-500 font-outfit text-sm leading-relaxed">{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <button
            className="flex-1 px-6 py-3 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-outfit order-2 sm:order-1"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 px-6 py-3 text-sm font-bold text-white rounded-xl shadow-lg transition-all font-outfit order-1 sm:order-2"
            style={{ 
              backgroundColor: buttonColor || '#4f46e5',
              boxShadow: `0 10px 15px -3px ${buttonColor ? buttonColor + '33' : '#4f46e533'}`
            }}
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
