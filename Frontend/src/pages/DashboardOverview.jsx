import React, { useEffect, useMemo, useState } from 'react';
import ExpenseModal from '@/components/model/ExpenseModal';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PlusCircle,
  MinusCircle,
  Plus,
  RefreshCw,
  CreditCard,
  Download,
  MoreHorizontal,
  DollarSign,
  Calendar
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useExpenseStore } from '@/components/store/expenseStore';
import { useBudgetStore } from '@/components/store/budgetStore';
import { useCategoryStore } from '@/components/store/categoryStore';

const MetricCard = ({ title, amount, change, changeType, icon, color }) => {
  const IconComponent = icon;

  return (
    <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/5 hover:shadow-2xl hover:shadow-indigo-600/10 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 font-outfit">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-gray-400 font-outfit">$</span>
            <h3 className="text-4xl font-extrabold text-gray-900 font-outfit tracking-tight">{amount}</h3>
          </div>
        </div>
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
          <IconComponent className={`w-7 h-7 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 py-1 px-3 rounded-full text-xs font-bold ${changeType === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
          {changeType === 'up' ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          <span>{change}</span>
        </div>
        <span className="text-gray-400 text-xs font-medium font-outfit">from last month</span>
      </div>
    </div>
  );
};

const ActionButton = ({ label, icon, color, onClick }) => {
  const IconComponent = icon;

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 p-5 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-600/5 hover:-translate-y-1 transition-all duration-300 group min-w-[120px]"
    >
      <div className={`p-4 rounded-2xl ${color} transition-all group-hover:scale-110 shadow-lg group-hover:shadow-xl group-hover:rotate-6`}>
        <IconComponent className="w-7 h-7 text-white" />
      </div>
      <span className="text-gray-600 text-[11px] font-extrabold uppercase tracking-widest font-outfit whitespace-nowrap">{label}</span>
    </button>
  );
};

const BudgetProgress = ({ category, used, total, percentage, color }) => (
  <div className="mb-6 last:mb-0">
    <div className="flex justify-between items-center mb-2">
      <span className="text-gray-700 font-medium font-outfit text-sm">{category}</span>
      <span className="text-gray-500 text-xs font-outfit font-bold">${used} / ${total}</span>
    </div>
    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full transition-all duration-1000`}
        style={{ width: `${percentage}%` }}
      />
    </div>
    <div className="flex justify-between items-center mt-2">
      <span className={`text-xs font-bold ${percentage > 90 ? 'text-red-600' : 'text-indigo-600'}`}>{percentage}% used</span>
      <span className="text-gray-400 text-xs">${total - used} remaining</span>
    </div>
  </div>
);

const DashboardOverview = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const { expenses, fetchExpenses } = useExpenseStore();
  const { budgetAmount, fetchBudget } = useBudgetStore();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchExpenses();
    fetchBudget();
    fetchCategories();
  }, [fetchExpenses, fetchBudget, fetchCategories]);

  const handleAddTransaction = (type) => {
    setSelectedExpense({ type });
    setOpenModal(true);
  };

  const metrics = useMemo(() => {
    const totalIncome = expenses.filter(e => e.type === 'income').reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const totalExpenses = expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const balance = totalIncome - totalExpenses;

    // Budget calculations
    const today = new Date();
    const currentMonth = today.getMonth();
    const curMonthExpenses = expenses
      .filter(e => {
        const d = new Date(e.date);
        return e.type === 'expense' && d.getMonth() === currentMonth;
      })
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const budgetLeft = Math.max(parseFloat(budgetAmount) - curMonthExpenses, 0);

    return {
      balance: balance.toLocaleString(),
      income: totalIncome.toLocaleString(),
      expenses: totalExpenses.toLocaleString(),
      budgetLeft: budgetLeft.toLocaleString(),
      curMonthExpenses
    };
  }, [expenses, budgetAmount]);

  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => {
      const monthExpenses = expenses
        .filter(e => e.type === 'expense' && new Date(e.date).getMonth() === index)
        .reduce((sum, e) => sum + parseFloat(e.amount), 0);
      const monthIncome = expenses
        .filter(e => e.type === 'income' && new Date(e.date).getMonth() === index)
        .reduce((sum, e) => sum + parseFloat(e.amount), 0);

      return {
        name: month,
        income: monthIncome || Math.floor(Math.random() * 2000) + 1000,
        expense: monthExpenses || Math.floor(Math.random() * 1000) + 500
      };
    });
  }, [expenses]);

  const categoryBudgets = useMemo(() => {
    return categories.map(cat => {
      const used = expenses
        .filter(e => e.category?.id === cat.id && e.type === 'expense')
        .reduce((sum, e) => sum + parseFloat(e.amount), 0);
      const total = 500;
      const percentage = Math.min(Math.round((used / total) * 100), 100);
      return { name: cat.name, used, total, percentage };
    });
  }, [categories, expenses]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Balance"
          amount={metrics.balance}
          change="+5.2%"
          changeType="up"
          icon={DollarSign}
          color="bg-green-600"
        />
        <MetricCard
          title="Monthly Income"
          amount={metrics.income}
          change="+12.1%"
          changeType="up"
          icon={TrendingUp}
          color="bg-blue-600"
        />
        <MetricCard
          title="Monthly Expenses"
          amount={metrics.expenses}
          change="+8.3%"
          changeType="down"
          icon={TrendingDown}
          color="bg-red-600"
        />
        <MetricCard
          title="Budget Left"
          amount={metrics.budgetLeft}
          change="15 days remaining"
          changeType="up"
          icon={Wallet}
          color="bg-orange-600"
        />
      </div>

      {/* Quick Actions Row */}
      <div className="flex flex-wrap gap-4 mb-10 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-4 min-w-max">
          <ActionButton label="Add Income" icon={PlusCircle} color="bg-green-600" onClick={() => handleAddTransaction('income')} />
          <ActionButton label="Add Expense" icon={MinusCircle} color="bg-red-500" onClick={() => handleAddTransaction('expense')} />
          <ActionButton label="Set Budget" icon={DollarSign} color="bg-gray-800" />
          <ActionButton label="Upload Receipt" icon={Plus} color="bg-gray-800" />
          <ActionButton label="Recurring" icon={RefreshCw} color="bg-gray-800" />
          <ActionButton label="Connect Bank" icon={CreditCard} color="bg-gray-800" />
          <ActionButton label="Import Data" icon={Download} color="bg-gray-800" />
          <ActionButton label="More" icon={MoreHorizontal} color="bg-gray-800" />
        </div>
      </div>

      {openModal && (
        <ExpenseModal
          onClose={() => setOpenModal(false)}
          expense={selectedExpense}
          categories={categories}
        />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Financial Overview */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1 font-outfit tracking-tight">Financial Overview</h2>
              <p className="text-gray-500 text-sm font-outfit">Your income vs expenses over the past 12 months</p>
            </div>
            <div className="flex gap-2">
              <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all font-outfit">Overview</button>
              <button className="px-5 py-2.5 text-gray-500 hover:bg-gray-50 rounded-xl text-sm font-bold transition-all font-outfit">Categories</button>
              <button className="px-5 py-2.5 text-gray-500 hover:bg-gray-50 rounded-xl text-sm font-bold transition-all font-outfit">Trends</button>
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '13px', fontWeight: 700 }}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#4f46e5"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorExpense)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Budget Overview */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 rounded-xl">
                <CreditCard className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 font-outfit tracking-tight">Budget Overview</h3>
                <p className="text-gray-500 text-xs font-outfit">Track your monthly spending</p>
              </div>
            </div>
            <button className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:text-indigo-600 hover:bg-indigo-50 transition-all">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
            {categoryBudgets.length > 0 ? (
              categoryBudgets.map((item, idx) => (
                <BudgetProgress
                  key={idx}
                  category={item.name}
                  used={item.used}
                  total={item.total}
                  percentage={item.percentage}
                  color={idx % 2 === 0 ? "bg-indigo-600" : "bg-blue-600"}
                />
              ))
            ) : (
              <p className="text-gray-400 text-center mt-10 font-medium">No active budgets</p>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-50">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span className="text-gray-700 text-sm font-semibold">Auto Savings Plan</span>
              </div>
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
