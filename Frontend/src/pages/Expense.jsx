import ExpenseModal from '@/components/model/ExpenseModal';
import Confirm from '@/components/model/Confirm';
import { deleteCategoryData } from '@/assets/constants/confirmdata';
import { useExpenseStore } from '@/components/store/expenseStore';
import { useCategoryStore } from '@/components/store/categoryStore';
import { useBudgetStore } from '@/components/store/budgetStore';

import React, { useEffect, useState, useMemo } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSave } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Expense = () => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);

    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [newBudget, setNewBudget] = useState('');

    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [newGoal, setNewGoal] = useState('');

    const { expenses, fetchExpenses, deleteExpense } = useExpenseStore();
    const { categories, fetchCategories } = useCategoryStore();
    const { budgetAmount, savingsGoal, fetchBudget, updateBudget } = useBudgetStore();

    useEffect(() => {
        fetchExpenses();
        fetchCategories();
        fetchBudget();
    }, [fetchExpenses, fetchCategories, fetchBudget]);

    // =========================
    // Budget Logic
    // =========================

    const safeBudget = parseFloat(budgetAmount || 0);

    const currentMonthExpenses = useMemo(() => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        return expenses.reduce((sum, exp) => {
            const expDate = new Date(exp.date);
            if (
                exp.type === "expense" &&
                expDate.getMonth() === currentMonth &&
                expDate.getFullYear() === currentYear
            ) {
                return sum + parseFloat(exp.amount);
            }
            return sum;
        }, 0);
    }, [expenses]);

    const budgetExceeded = currentMonthExpenses > safeBudget;

    const budgetProgress =
        safeBudget > 0
            ? Math.min((currentMonthExpenses / safeBudget) * 100, 100)
            : 0;

    // =========================
    // Total Calculations
    // =========================

    const totalIncome = useMemo(() => {
        return expenses.reduce(
            (sum, item) =>
                item.type === "income" ? sum + parseFloat(item.amount) : sum,
            0
        );
    }, [expenses]);

    const totalExpenses = useMemo(() => {
        return expenses.reduce(
            (sum, item) =>
                item.type === "expense" ? sum + parseFloat(item.amount) : sum,
            0
        );
    }, [expenses]);

    const totalBalance = totalIncome - totalExpenses;

    // =========================
    // Pie Chart Data
    // =========================

    const expenseByCategory = useMemo(() => {
        return Object.values(
            expenses
                .filter(e => e.type === "expense")
                .reduce((acc, curr) => {
                    const catName = curr.category?.name || "Uncategorized";

                    if (!acc[catName]) {
                        acc[catName] = { name: catName, value: 0 };
                    }

                    acc[catName].value += parseFloat(curr.amount);
                    return acc;
                }, {})
        );
    }, [expenses]);

    // =========================
    // Handlers
    // =========================

    const handleAddNew = () => {
        setSelectedExpense(null);
        setOpenModal(true);
    };

    const handleEdit = (expense) => {
        setSelectedExpense(expense);
        setOpenModal(true);
    };

    const handleDelete = async () => {
        if (!expenseToDelete) return;
        await deleteExpense(expenseToDelete.id);
        setShowModal(false);
        setExpenseToDelete(null);
    };

    const handleSaveBudget = async () => {
        if (newBudget !== '' && !isNaN(newBudget)) {
            await updateBudget(parseFloat(newBudget), undefined);
        }
        setIsEditingBudget(false);
    };

    const handleSaveGoal = async () => {
        if (newGoal !== '' && !isNaN(newGoal)) {
            await updateBudget(undefined, parseFloat(newGoal));
        }
        setIsEditingGoal(false);
    };

    return (
        <div className="space-y-6">

            {/* ================= Budget Overview ================= */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Monthly Budget Overview
                </h2>

                <div className="flex flex-col md:flex-row gap-6">

                    {/* Budget */}
                    <div className="bg-gray-50 p-4 rounded-xl flex-1">
                        <p className="text-gray-500 text-sm font-semibold uppercase">
                            Set Monthly Budget
                        </p>

                        {isEditingBudget ? (
                            <div className="flex items-center gap-2 mt-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                                    <input
                                        type="number"
                                        className="pl-7 pr-4 py-2 bg-white border-2 border-indigo-100 rounded-xl w-32 focus:border-indigo-500 outline-none transition-all font-bold text-gray-800 shadow-sm"
                                        value={newBudget}
                                        onChange={(e) => setNewBudget(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <button
                                    onClick={handleSaveBudget}
                                    className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
                                >
                                    <FaSave size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 mt-2 group">
                                <h3 className="text-3xl font-extrabold text-indigo-700 font-outfit">
                                    ${safeBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </h3>
                                <button
                                    onClick={() => {
                                        setIsEditingBudget(true);
                                        setNewBudget(safeBudget);
                                    }}
                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                >
                                    <FaEdit size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Savings Goal */}
                    <div className="bg-gray-50 p-4 rounded-xl flex-1">
                        <p className="text-gray-500 text-sm font-semibold uppercase">
                            Total Savings Goal
                        </p>

                        {isEditingGoal ? (
                            <div className="flex items-center gap-2 mt-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                                    <input
                                        type="number"
                                        className="pl-7 pr-4 py-2 bg-white border-2 border-green-100 rounded-xl w-32 focus:border-green-500 outline-none transition-all font-bold text-gray-800 shadow-sm"
                                        value={newGoal}
                                        onChange={(e) => setNewGoal(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <button
                                    onClick={handleSaveGoal}
                                    className="p-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                                >
                                    <FaSave size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 mt-2 group">
                                <h3 className="text-3xl font-extrabold text-green-600 font-outfit">
                                    ${parseFloat(savingsGoal || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </h3>
                                <button
                                    onClick={() => {
                                        setIsEditingGoal(true);
                                        setNewGoal(savingsGoal || 0);
                                    }}
                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                >
                                    <FaEdit size={16} />
                                </button>
                            </div>
                        )}
                        <p className="text-sm text-gray-500 mt-2">
                            {(savingsGoal > 0 ? Math.min((totalBalance / savingsGoal) * 100, 100).toFixed(1) : 0)}% Reached
                        </p>
                    </div>

                    {/* Current Spending */}
                    <div className="bg-gray-50 p-4 rounded-xl flex-1">
                        <p className="text-gray-500 text-sm font-semibold uppercase">
                            This Month's Spending
                        </p>

                        <h3 className={`text-3xl font-bold mt-2 ${budgetExceeded ? "text-red-500" : "text-gray-800"}`}>
                            ${currentMonthExpenses.toFixed(2)}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                            {budgetProgress.toFixed(1)}% Used
                        </p>

                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                            <div className={`h-2.5 rounded-full ${budgetExceeded ? "bg-red-500" : "bg-indigo-600"}`} style={{ width: `${budgetProgress}%` }} />
                        </div>

                        {budgetExceeded && (
                            <p className="text-red-500 text-xs mt-2 font-medium">⚠️ You have exceeded your monthly budget!</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ================= Metrics ================= */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-xl border-l-4 border-indigo-500 hover:shadow-2xl transition-all duration-300">
                    <h3 className="text-gray-500 text-sm font-bold uppercase mb-2 tracking-wider">
                        Total Balance
                    </h3>
                    <p className="text-4xl font-extrabold text-gray-900 font-outfit">
                        ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-xl border-l-4 border-green-500 hover:shadow-2xl transition-all duration-300">
                    <h3 className="text-gray-500 text-sm font-bold uppercase mb-2 tracking-wider">
                        Total Income
                    </h3>
                    <p className="text-4xl font-extrabold text-green-600 font-outfit">
                        +${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-xl border-l-4 border-red-500 hover:shadow-2xl transition-all duration-300">
                    <h3 className="text-gray-500 text-sm font-bold uppercase mb-2 tracking-wider">
                        Total Expenses
                    </h3>
                    <p className="text-4xl font-extrabold text-red-500 font-outfit">
                        -${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

            {/* ================= Pie Chart ================= */}
            {expenseByCategory.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold mb-6">
                        Expense Distribution
                    </h3>

                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenseByCategory}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    dataKey="value"
                                >
                                    {expenseByCategory.map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={
                                                ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6'][index % 5]
                                            }
                                        />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* ================= Expense Table ================= */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Manage Expenses</h1>
                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                    >
                        <FaPlus /> Add Transaction
                    </button>
                </div>

                {expenses.length === 0 ? (
                    <p className="text-center text-gray-500">
                        No transactions found.
                    </p>
                ) : (
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left">Amount</th>
                                <th className="py-3 px-4 text-left">Category</th>
                                <th className="py-3 px-4 text-left">Description</th>
                                <th className="py-3 px-4 text-left">Date</th>
                                <th className="py-3 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50/50 group">
                                    <td className="py-4 px-4 font-bold">
                                        <span className={expense.type === 'income' ? 'text-green-600' : 'text-indigo-600'}>
                                            {expense.type === 'income' ? '+' : '-'}${parseFloat(expense.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${expense.type === 'income' ? 'bg-green-100/50 text-green-800' : 'bg-indigo-50/50 text-indigo-700'}`}>
                                            {expense.category?.name || "Uncategorized"}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="font-medium text-gray-800">{expense.description}</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{expense.type}</div>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-500 font-medium whitespace-nowrap">
                                        {new Date(expense.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(expense)}
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            >
                                                <FaEdit size={16} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setExpenseToDelete(expense);
                                                    setShowModal(true);
                                                }}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>


            {openModal && (
                <ExpenseModal
                    onClose={() => setOpenModal(false)}
                    expense={selectedExpense}
                    categories={categories}
                />
            )}

            {showModal && (
                <Confirm
                    onClose={() => setShowModal(false)}
                    onConfirm={handleDelete}
                    title="Delete Transaction"
                    message={deleteCategoryData.message}
                    buttonText={deleteCategoryData.buttonText}
                    Icon={deleteCategoryData.Icon}
                    buttonColor={deleteCategoryData.buttonColor}
                    iconBgColor={deleteCategoryData.iconBgColor}
                    iconColor={deleteCategoryData.iconColor}
                />
            )}

        </div>
    );
};

export default Expense;
