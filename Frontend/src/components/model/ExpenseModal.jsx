import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from "react-hook-form";
import { useExpenseStore } from '../store/expenseStore';

const ExpenseModal = ({ onClose, expense, categories }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { createExpense, updateExpense } = useExpenseStore();

    // If editing, pre-fill form
    useEffect(() => {
        if (expense) {
            reset({
                type: expense.type || 'expense',
                amount: expense.amount,
                description: expense.description,
                date: expense.date,
                categoryUrlId: expense.category ? expense.category.id : ""
            });
        } else {
            reset({
                type: 'expense',
                amount: "",
                description: "",
                date: new Date().toISOString().split('T')[0], // Today's date by default
                categoryUrlId: ""
            });
        }
    }, [expense, reset]);

    const onSubmit = (data) => {
        const payload = {
            type: data.type,
            amount: data.amount,
            description: data.description,
            date: data.date,
            category_id: data.categoryUrlId || null
        };

        if (expense) {
            updateExpense(expense.id, payload);
        } else {
            createExpense(payload);
        }
        onClose();
    };

    return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4"
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-outfit">
              {expense ? "Edit Transaction" : "New Transaction"}
            </h2>
            <p className="text-sm text-gray-500 mt-1 font-outfit">
              {expense ? "Update your transaction details." : "Log a new income or expense."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all font-outfit"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="type" className="text-sm font-bold text-gray-700 font-outfit block mb-2">
                Type
              </label>
              <select
                id="type"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none font-outfit appearance-none"
                {...register("type")}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="text-sm font-bold text-gray-700 font-outfit block mb-2">
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                id="amount"
                placeholder="0.00"
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all font-outfit ${
                  errors.amount 
                  ? 'border-red-400 focus:ring-4 focus:ring-red-600/5' 
                  : 'border-gray-100 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5'
                }`}
                {...register("amount", {
                  required: "Amount is required.",
                  min: { value: 0.01, message: "Greater than 0" }
                })}
              />
              {errors.amount && <p className="text-red-500 text-xs mt-1 font-bold font-outfit">{errors.amount.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="categoryUrlId" className="text-sm font-bold text-gray-700 font-outfit block mb-2">
              Category
            </label>
            <select
              id="categoryUrlId"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none font-outfit appearance-none"
              {...register("categoryUrlId")}
            >
              <option value="">-- No Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="text-sm font-bold text-gray-700 font-outfit block mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all font-outfit ${
                errors.date 
                ? 'border-red-400 focus:ring-4 focus:ring-red-600/5' 
                : 'border-gray-100 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5'
              }`}
              {...register("date", { required: "Date is required" })}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1 font-bold font-outfit">{errors.date.message}</p>}
          </div>

          <div>
            <label htmlFor="description" className="text-sm font-bold text-gray-700 font-outfit block mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="What was this for?"
              className={`w-full resize-none px-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all font-outfit ${
                errors.description 
                ? 'border-red-400 focus:ring-4 focus:ring-red-600/5' 
                : 'border-gray-100 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5'
              }`}
              {...register("description", { required: "Description is required." })}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1 font-bold font-outfit">{errors.description.message}</p>}
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
              {expense ? "Update Changes" : "Save Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
    );
};

export default ExpenseModal;
