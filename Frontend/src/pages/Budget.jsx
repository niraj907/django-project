import React, { useState, useMemo, useEffect } from 'react'
import { FaWallet, FaPlus, FaArrowUp, FaArrowDown, FaExclamationTriangle } from 'react-icons/fa';
import { useBudgetStore } from '@/components/store/budgetStore';
import { useExpenseStore } from '@/components/store/expenseStore';
import { useBudgetCategoryStore } from '@/components/store/budgetCategoryStore';
import BudgetModal from '@/components/model/BudgetModal';
import BudgetCategories from './BudgetCategories';


const Budget = () => {
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const { budgetAmount, fetchBudget, loading } = useBudgetStore();
    const { expenses, fetchExpenses } = useExpenseStore();
    const { budgetCategories, fetchBudgetCategories } = useBudgetCategoryStore();

    useEffect(() => {
        fetchBudget();
        fetchExpenses();
        fetchBudgetCategories();
    }, [fetchBudget, fetchExpenses, fetchBudgetCategories]);

    // Calculate metrics
    const totalBudget = useMemo(() => {
        return budgetCategories.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    }, [budgetCategories]);

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

    const budgetRemaining = totalBudget - currentMonthExpenses;
    const spentPercentage = totalBudget > 0 ? ((currentMonthExpenses / totalBudget) * 100).toFixed(1) : 0;

    // Count alerts
    const alertCount = useMemo(() => {
        let over = 0;
        let near = 0;
        const now = new Date();
        budgetCategories.forEach((item) => {
            const spent = expenses
                .filter((exp) => {
                    if (exp.type !== 'expense' || exp.category?.id !== item.category?.id) return false;
                    const expDate = new Date(exp.date);
                    return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
                })
                .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

            const percentage = (spent / parseFloat(item.amount)) * 100;
            if (percentage >= 100) over++;
            else if (percentage >= parseFloat(item.alert_threshold)) near++;
        });
        return { over, near };
    }, [budgetCategories, expenses]);

    const handleBudget = () => {
        setSelectedBudget(null);
        setOpenModal(true);
    };

    if (loading && !budgetAmount) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-8 animate-in fade-in duration-700">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Budget Planning</h1>
                        <p className="text-gray-500 mt-1">Set and track your spending limits across different categories.</p>
                    </div>

                    <button
                        onClick={handleBudget}
                        className="flex items-center gap-2 bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95 whitespace-nowrap"
                    >
                        <FaPlus size={14} /> Create Budget
                    </button>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Budget */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 bg-green-50 rounded-xl text-green-600">
                                <FaWallet size={18} />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-gray-400 mb-1">Total Budget</p>
                        <h3 className="text-2xl font-extrabold text-gray-900">
                            ${totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h3>
                        <p className="text-xs text-gray-400 mt-2">This month</p>
                    </div>

                    {/* Total Spent */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                                <FaArrowUp size={18} />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-gray-400 mb-1">Total Spent</p>
                        <h3 className="text-2xl font-extrabold text-gray-900">
                            ${currentMonthExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h3>
                        <p className="text-xs text-gray-400 mt-2">{spentPercentage}% of budget</p>
                    </div>

                    {/* Remaining */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2.5 rounded-xl ${budgetRemaining >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                <FaArrowDown size={18} />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-gray-400 mb-1">Remaining</p>
                        <h3 className={`text-2xl font-extrabold ${budgetRemaining >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                            ${Math.abs(budgetRemaining).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h3>
                        <p className="text-xs text-gray-400 mt-2">{budgetRemaining < 0 ? 'Over budget' : 'Left to spend'}</p>
                    </div>

                    {/* Alerts */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 bg-orange-50 rounded-xl text-orange-600">
                                <FaExclamationTriangle size={18} />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-gray-400 mb-1">Alerts</p>
                        <h3 className="text-2xl font-extrabold text-gray-900">
                            {alertCount.over + alertCount.near}
                        </h3>
                        <p className="text-xs text-gray-400 mt-2">
                            {alertCount.over > 0 ? `${alertCount.over} over` : ''}
                            {alertCount.over > 0 && alertCount.near > 0 ? ', ' : ''}
                            {alertCount.near > 0 ? `${alertCount.near} near limit` : ''}
                            {alertCount.over === 0 && alertCount.near === 0 ? 'All budgets on track' : ''}
                        </p>
                    </div>
                </div>

                {/* Budget Categories Table */}
                <BudgetCategories />

                {/* Budget Tips & Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Budget Tips</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                                <p className="text-sm text-gray-600">Try to save at least 20% of your income every month.</p>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                                <p className="text-sm text-gray-600">Review your "Over Budget" categories to find potential savings.</p>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                                <p className="text-sm text-gray-600">Automate your savings to reach your goals faster.</p>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Monthly Breakdown</h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm mb-2 font-semibold">
                                    <span className="text-gray-500">Fixed Expenses</span>
                                    <span className="text-gray-900">45%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-indigo-400 h-2 rounded-full" style={{ width: '45%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2 font-semibold">
                                    <span className="text-gray-500">Variable Expenses</span>
                                    <span className="text-gray-900">30%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-indigo-300 h-2 rounded-full" style={{ width: '30%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2 font-semibold">
                                    <span className="text-gray-500">Savings</span>
                                    <span className="text-gray-900">25%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-green-400 h-2 rounded-full" style={{ width: '25%' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Budget Modal */}
            {openModal && (
                <BudgetModal
                    onClose={() => {
                        setOpenModal(false);
                        fetchBudgetCategories();
                    }}
                    budget={selectedBudget}
                />
            )}
        </>
    );
}

export default Budget