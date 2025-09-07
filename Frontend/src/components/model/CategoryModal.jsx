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
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div
        className="relative flex w-11/12 max-w-md flex-col rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
            {category ? "Edit Category" : "Add New Category"}
          </h2>
          <button
            type="button"
            aria-label="Close modal"
            className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label htmlFor="categoryName" className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="categoryName"
              placeholder="Enter category name"
              className={`w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                errors.categoryName
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
              {...register("categoryName", {
                required: "Category name is required.",
                minLength: { value: 3, message: "Name must be at least 3 characters long." }
              })}
            />
            {errors.categoryName && <p className="mt-1 text-sm text-red-600">{errors.categoryName.message}</p>}
          </div>

          <div>
            <label htmlFor="categoryDescription" className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="categoryDescription"
              rows={3}
              placeholder="A brief description of the category..."
              className={`w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.categoryDescription
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
              {...register("categoryDescription", { required: "Description is required." })}
            />
            {errors.categoryDescription && <p className="mt-1 text-sm text-red-600">{errors.categoryDescription.message}</p>}
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-800 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2"
            >
              {category ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
