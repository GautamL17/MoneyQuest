// src/components/Budget.jsx
import { useState, useEffect, useMemo } from "react";
import useBudgetStore from "../../store/useBudgetStore";
import BudgetForm from "./BudgetForm";
import BudgetOverview from "./BudgetOverview";
import toast from "react-hot-toast";

const Budget = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ name: "", amount: "", category: "" });
  const [transaction, setTransaction] = useState({ category: "", amount: "", description: "" });
  const [selectedBudgetId, setSelectedBudgetId] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedWeek, setSelectedWeek] = useState(1);

  const { budgets, loading, error, fetchBudgets, addSpending } = useBudgetStore();

  useEffect(() => { fetchBudgets(); }, [fetchBudgets]);

  // Filters
  const filteredBudgets = useMemo(() => {
    if (selectedPeriod === "weekly") {
      return budgets.filter((b) => b.period === "weekly" && b.week === selectedWeek);
    }
    return budgets.filter((b) => b.period === selectedPeriod);
  }, [budgets, selectedPeriod, selectedWeek]);

  const summary = useMemo(() => {
    const income = filteredBudgets.reduce((sum, b) => sum + (b.salary || 0), 0);
    const spent = filteredBudgets.reduce((sum, b) => sum + (b.totalSpent || 0), 0);
    return { income, spent, remaining: income - spent };
  }, [filteredBudgets]);

  const goalsWithProgress = useMemo(() => {
    return goals.map((goal) => {
      const progress = Math.min((summary.spent / goal.amount) * 100, 100);
      return { ...goal, progress };
    });
  }, [goals, summary.spent]);

  // Handlers
  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.amount || !newGoal.category) {
      return toast.error("Please fill all goal fields");
    }
    setGoals([...goals, { ...newGoal, amount: Number(newGoal.amount) }]);
    setNewGoal({ name: "", amount: "", category: "" });
  };

  const handleAddTransaction = async () => {
    if (!selectedBudgetId) return toast.error("Please select a budget");
    if (!transaction.category) return toast.error("Please select a category");
    if (!transaction.amount || Number(transaction.amount) <= 0) return toast.error("Please enter a valid amount");

    const selectedBudget = budgets.find((b) => b._id === selectedBudgetId);
    if (!selectedBudget) return toast.error("Selected budget not found");

    const normalizedCategory = transaction.category.trim();
    const categoryExists = selectedBudget.categories.some(
      (c) => c.name?.trim().toLowerCase() === normalizedCategory.toLowerCase()
    );
    if (!categoryExists) return toast.error(`Category "${normalizedCategory}" does not exist`);

    try {
      await addSpending(selectedBudgetId, {
        category: normalizedCategory,
        amount: Number(transaction.amount),
        description: transaction.description,
      });
      setTransaction({ category: "", amount: "", description: "" });
      toast.success("Transaction added successfully ✅");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add transaction ❌");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">💰 Budget Dashboard</h1>
          <p className="text-gray-400 mt-1">Plan, save, and track your money smarter.</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 rounded bg-zinc-900 text-white border border-zinc-700"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          {selectedPeriod === "weekly" && (
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
              className="px-3 py-2 rounded bg-zinc-900 text-white border border-zinc-700"
            >
              {[1, 2, 3, 4].map((w) => (
                <option key={w} value={w}>Week {w}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Loading/Error */}
      {loading && <p className="text-gray-400">Loading budgets...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 text-center shadow-xl hover:scale-[1.02] transition">
          <p className="text-sm text-gray-400">Income</p>
          <p className="text-lg font-bold text-green-400">₹{summary.income}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 text-center shadow-xl hover:scale-[1.02] transition">
          <p className="text-sm text-gray-400">Expenditure</p>
          <p className="text-lg font-bold text-red-400">₹{summary.spent}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 text-center shadow-xl hover:scale-[1.02] transition">
          <p className="text-sm text-gray-400">Remaining</p>
          <p className="text-lg font-bold text-blue-400">₹{summary.remaining}</p>
        </div>
      </div>

      {/* Budget Form */}
      <BudgetForm />

      {/* Transaction Form */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-xl space-y-4">
        <h2 className="text-white font-semibold text-lg">➕ Add Transaction</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select
            className="bg-zinc-800 border border-zinc-700 p-2 rounded text-white"
            value={selectedBudgetId}
            onChange={(e) => setSelectedBudgetId(e.target.value)}
          >
            <option value="">Select Budget</option>
            {filteredBudgets.map((b) => (
              <option key={b._id} value={b._id}>
                {b.period.charAt(0).toUpperCase() + b.period.slice(1)} Budget - ₹{b.totalBudget}
              </option>
            ))}
          </select>

          <select
            className="bg-zinc-800 border border-zinc-700 p-2 rounded text-white"
            value={transaction.category}
            onChange={(e) => setTransaction({ ...transaction, category: e.target.value })}
            disabled={!selectedBudgetId}
          >
            <option value="">Select Category</option>
            {selectedBudgetId &&
              filteredBudgets
                .find((b) => b._id === selectedBudgetId)
                ?.categories.map((c, idx) => (
                  <option key={idx} value={c.name}>{c.name}</option>
                ))}
          </select>

          <input
            type="number"
            placeholder="Amount"
            className="bg-zinc-800 border border-zinc-700 p-2 rounded text-white"
            value={transaction.amount}
            onChange={(e) => setTransaction({ ...transaction, amount: e.target.value })}
          />
        </div>

        <input
          type="text"
          placeholder="Description (optional)"
          className="bg-zinc-800 border border-zinc-700 p-2 rounded text-white w-full"
          value={transaction.description}
          onChange={(e) => setTransaction({ ...transaction, description: e.target.value })}
        />

        <button
          onClick={handleAddTransaction}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-all font-semibold"
        >
          Add Transaction
        </button>
      </div>

      {/* Budget Overview */}
      <BudgetOverview budgets={filteredBudgets} />

      {/* Goals Progress */}
      {goalsWithProgress.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-white font-semibold text-lg">🎯 Goals Progress</h2>
          {goalsWithProgress.map((goal, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>{goal.name} ({goal.category})</span>
                <span>{Math.round(goal.progress)}%</span>
              </div>
              <div className="w-full bg-zinc-700 h-3 rounded">
                <div
                  className="h-3 rounded bg-green-500 transition-all"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Budget;
