import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useBudgetCategoryStore } from '@/components/store/budgetCategoryStore';
import { useExpenseStore } from '@/components/store/expenseStore';
import { toast } from "sonner";
import BudgetModal from '@/components/model/BudgetModal';

const BudgetCategories = () => {
    const { budgetCategories, fetchBudgetCategories, deleteBudgetCategory, loading } = useBudgetCategoryStore();
    const { expenses } = useExpenseStore();
    const [editBudget, setEditBudget] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        fetchBudgetCategories();
    }, [fetchBudgetCategories]);

    // Calculate spent amount per category for the current period
    const getSpentAmount = (categoryId) => {
        const now = new Date();
        return expenses
            .filter((exp) => {
                if (exp.type !== 'expense' || exp.category?.id !== categoryId) return false;
                const expDate = new Date(exp.date);
                // For simplicity, filter current month
                return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
            })
            .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this budget?")) {
            try {
                await deleteBudgetCategory(id);
                toast.success("Budget deleted successfully");
            } catch {
                toast.error("Failed to delete budget");
            }
        }
    };

    const handleEdit = (budget) => {
        setEditBudget(budget);
        setShowEditModal(true);
    };

    const getStatusBadge = (spent, amount, threshold) => {
        const percentage = (spent / parseFloat(amount)) * 100;
        if (percentage >= 100) {
            return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-red-600">Over Budget</span>;
        } else if (percentage >= parseFloat(threshold)) {
            return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-600">Near Limit</span>;
        }
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-green-100 text-green-600">On Track</span>;
    };

    const getProgressColor = (spent, amount, threshold) => {
        const percentage = (spent / parseFloat(amount)) * 100;
        if (percentage >= 100) return 'bg-red-500';
        if (percentage >= parseFloat(threshold)) return 'bg-amber-500';
        return 'bg-indigo-600';
    };

    if (loading && budgetCategories.length === 0) {
        return (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 col-span-full">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 col-span-full">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Category Budgets</h3>
                    <span className="text-sm text-gray-400 font-medium">{budgetCategories.length} categories</span>
                </div>

                {budgetCategories.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <p className="text-gray-400 font-medium">No category budgets yet.</p>
                        <p className="text-gray-300 text-sm mt-1">Click "Create Budget" to get started.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Budget</th>
                                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Spent</th>
                                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Progress</th>
                                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Period</th>
                                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="text-right py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {budgetCategories.map((item) => {
                                    const spent = getSpentAmount(item.category?.id);
                                    const budgetAmt = parseFloat(item.amount);
                                    const remaining = budgetAmt - spent;
                                    const percentage = budgetAmt > 0 ? Math.min((spent / budgetAmt) * 100, 100) : 0;

                                    return (
                                        <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            {/* Category */}
                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="font-bold text-gray-900">{item.category?.name || "Uncategorized"}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">Threshold: {item.alert_threshold}%</p>
                                                </div>
                                            </td>

                                            {/* Budget Amount */}
                                            <td className="py-4 px-4">
                                                <span className="font-bold text-gray-900">
                                                    ${budgetAmt.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </span>
                                            </td>

                                            {/* Spent */}
                                            <td className="py-4 px-4">
                                                <span className={`font-bold ${spent > budgetAmt ? 'text-red-600' : 'text-gray-700'}`}>
                                                    ${spent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </span>
                                            </td>

                                            {/* Progress */}
                                            <td className="py-4 px-4 min-w-[160px]">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full transition-all duration-700 ease-out ${getProgressColor(spent, item.amount, item.alert_threshold)}`}
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-500 w-10 text-right">{percentage.toFixed(0)}%</span>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    ${remaining >= 0 ? remaining.toFixed(2) : '0.00'} remaining
                                                </p>
                                            </td>

                                            {/* Period */}
                                            <td className="py-4 px-4">
                                                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-indigo-50 text-indigo-600 capitalize">
                                                    {item.period}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-4">
                                                {getStatusBadge(spent, item.amount, item.alert_threshold)}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                        title="Edit"
                                                    >
                                                        <FaEdit size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                        title="Delete"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <BudgetModal
                    onClose={() => {
                        setShowEditModal(false);
                        setEditBudget(null);
                        fetchBudgetCategories();
                    }}
                    budget={editBudget}
                />
            )}
        </>
    );
};

export default BudgetCategories;