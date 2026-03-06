import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from "react-hook-form";
import { useCategoryStore } from '../store/categoryStore';

const CategoryModal = ({ onClose, category }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { createCategory, updateCategory } = useCategoryStore();

  // If editing, pre-fill form
  useEffect(() => {
    if (category) {
      reset({
        categoryName: category.name,
        categoryDescription: category.description
      });
    } else {
      reset({
        categoryName: "",
        categoryDescription: ""
      });
    }
  }, [category, reset]);

  const onSubmit = (data) => {
    const payload = {
      name: data.categoryName,
      description: data.categoryDescription,
    };

    if (category) {
      // Update existing category
      updateCategory(category.id, payload);
    } else {
      // Create new category
      createCategory(payload);
    }

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4"
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div>
            <h2 id="modal-title" className="text-2xl font-bold text-gray-900 font-outfit">
              {category ? "Edit Category" : "New Category"}
            </h2>
            <p className="text-sm text-gray-500 mt-1 font-outfit">
              {category ? "Modify your spending category details." : "Create a new category for your expenses."}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close modal"
            className="p-2.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all font-outfit"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div>
            <label htmlFor="categoryName" className="text-sm font-bold text-gray-700 font-outfit block mb-2">
              Name
            </label>
            <input
              type="text"
              id="categoryName"
              placeholder="e.g. Groceries, Entertainment"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all font-outfit ${
                errors.categoryName
                  ? 'border-red-400 focus:ring-4 focus:ring-red-600/5'
                  : 'border-gray-100 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5'
              }`}
              {...register("categoryName", {
                required: "Category name is required.",
                minLength: { value: 3, message: "Name must be at least 3 characters long." }
              })}
            />
            {errors.categoryName && <p className="text-red-500 text-xs mt-1 font-bold font-outfit">{errors.categoryName.message}</p>}
          </div>

          <div>
            <label htmlFor="categoryDescription" className="text-sm font-bold text-gray-700 font-outfit block mb-2">
              Description
            </label>
            <textarea
              id="categoryDescription"
              rows={3}
              placeholder="What kind of expenses go here?"
              className={`w-full resize-none px-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all font-outfit ${
                errors.categoryDescription
                  ? 'border-red-400 focus:ring-4 focus:ring-red-600/5'
                  : 'border-gray-100 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5'
              }`}
              {...register("categoryDescription", { required: "Description is required." })}
            />
            {errors.categoryDescription && <p className="text-red-500 text-xs mt-1 font-bold font-outfit">{errors.categoryDescription.message}</p>}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
            <button
              type="button"
              className="px-6 py-3 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-outfit"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all font-outfit"
            >
              {category ? "Update Category" : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
