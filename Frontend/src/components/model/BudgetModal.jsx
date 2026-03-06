import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from "react-hook-form";
import { useBudgetCategoryStore } from '../store/budgetCategoryStore';
import { useCategoryStore } from '../store/categoryStore';
import { toast } from "sonner";

const BudgetModal = ({ onClose, budget }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const { createBudgetCategory, updateBudgetCategory } = useBudgetCategoryStore();
    const { categories, fetchCategories } = useCategoryStore();

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // If editing, pre-fill form
    useEffect(() => {
        if (budget) {
            reset({
                category: budget.category?.id || "",
                amount: budget.amount || "",
                period: budget.period || "",
                alertThreshold: budget.alert_threshold || "",
            });
        } else {
            reset({
                category: "",
                amount: "",
                period: "",
                alertThreshold: "",
            });
        }
    }, [budget, reset]);

    const onSubmit = async (data) => {
        const payload = {
            category_id: parseInt(data.category),
            amount: parseFloat(data.amount),
            period: data.period,
            alert_threshold: parseFloat(data.alertThreshold),
        };

        try {
            if (budget) {
                await updateBudgetCategory(budget.id, payload);
                toast.success("Budget updated successfully");
            } else {
                await createBudgetCategory(payload);
                toast.success("Budget created successfully");
            }
            onClose();
        } catch (err) {
            const errorData = err.response?.data;
            if (errorData) {
                const firstKey = Object.keys(errorData)[0];
                if (firstKey && Array.isArray(errorData[firstKey])) {
                    toast.error(errorData[firstKey][0]);
                } else {
                    toast.error(JSON.stringify(errorData));
                }
            } else {
                toast.error("Something went wrong");
            }
        }
    };

    const inputBaseClass = "w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all font-outfit";
    const inputNormalClass = "border-gray-100 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5";
    const inputErrorClass = "border-red-400 focus:ring-4 focus:ring-red-600/5";

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="budget-modal-title"
            className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-gray-100">
                    <div>
                        <h2 id="budget-modal-title" className="text-2xl font-bold text-gray-900 font-outfit">
                            {budget ? "Edit Budget" : "Create New Budget"}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1 font-outfit">
                            {budget ? "Modify your budget details." : "Set a spending limit for a specific category."}
                        </p>
                    </div>
                    <button
                        type="button"
                        aria-label="Close modal"
                        className="p-2.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                    {/* Row 1: Category & Budget Amount */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Category */}
                        <div>
                            <label htmlFor="budgetCategory" className="text-sm font-bold text-gray-700 font-outfit block mb-2">
                                Category
                            </label>
                            <select
                                id="budgetCategory"
                                className={`${inputBaseClass} ${errors.category ? inputErrorClass : inputNormalClass} appearance-none cursor-pointer`}
                                {...register("category", {
                                    required: "Please select a category.",
                                })}
                            >
                                <option value="">Select category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category && <p className="text-red-500 text-xs mt-1 font-bold font-outfit">{errors.category.message}</p>}
                        </div>

                        {/* Budget Amount */}
                        <div>
                            <label htmlFor="budgetAmount" className="text-sm font-bold text-gray-700 font-outfit block mb-2">
                                Budget Amount
                            </label>
                            <input
                                type="number"
                                id="budgetAmount"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                className={`${inputBaseClass} ${errors.amount ? inputErrorClass : inputNormalClass}`}
                                {...register("amount", {
                                    required: "Amount is required.",
                                    min: { value: 0.01, message: "Amount must be greater than 0." },
                                })}
                            />
                            {errors.amount && <p className="text-red-500 text-xs mt-1 font-bold font-outfit">{errors.amount.message}</p>}
                        </div>
                    </div>

                    {/* Row 2: Period & Alert Threshold */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Period */}
                        <div>
                            <label htmlFor="budgetPeriod" className="text-sm font-bold text-gray-700 font-outfit block mb-2">
                                Period
                            </label>
                            <select
                                id="budgetPeriod"
                                className={`${inputBaseClass} ${errors.period ? inputErrorClass : inputNormalClass} appearance-none cursor-pointer`}
                                {...register("period", {
                                    required: "Please select a period.",
                                })}
                            >
                                <option value="">Select period</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                            {errors.period && <p className="text-red-500 text-xs mt-1 font-bold font-outfit">{errors.period.message}</p>}
                        </div>

                        {/* Alert Threshold */}
                        <div>
                            <label htmlFor="alertThreshold" className="text-sm font-bold text-gray-700 font-outfit block mb-2">
                                Alert Threshold (%)
                            </label>
                            <input
                                type="number"
                                id="alertThreshold"
                                min="0"
                                max="100"
                                placeholder="80"
                                className={`${inputBaseClass} ${errors.alertThreshold ? inputErrorClass : inputNormalClass}`}
                                {...register("alertThreshold", {
                                    required: "Threshold is required.",
                                    min: { value: 1, message: "Must be at least 1%." },
                                    max: { value: 100, message: "Cannot exceed 100%." },
                                })}
                            />
                            {errors.alertThreshold && <p className="text-red-500 text-xs mt-1 font-bold font-outfit">{errors.alertThreshold.message}</p>}
                        </div>
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
                            {budget ? "Update Budget" : "Create Budget"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BudgetModal;
