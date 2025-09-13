// src/components/BudgetForm.jsx
import { useState } from "react";
import useBudgetStore from "../../store/useBudgetStore";
import toast from "react-hot-toast";

const defaultCategories = [
  "Food",
  "Transport",
  "Shopping",
  "Rent",
  "Entertainment",
  "Health",
  "Utilities",
  "Other",
];

const BudgetForm = () => {
  const { createBudget, loading } = useBudgetStore();

  const [form, setForm] = useState({
    totalBudget: "",
    period: "monthly",
    salary: "",
    savingsGoal: "",
    categories: [],
  });

  // generic handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // category handlers
  const handleCategoryChange = (index, key, value) => {
    const newCategories = [...form.categories];
    newCategories[index] = {
      ...newCategories[index],
      [key]: key === "allocated" ? Number(value) : value,
    };
    setForm({ ...form, categories: newCategories });
  };

  const addEmptyCategory = () => {
    setForm({
      ...form,
      categories: [...form.categories, { name: "", allocated: 0 }],
    });
  };

  const addDefaultCategories = () => {
    const mapped = defaultCategories.map((name) => ({ name, allocated: 0 }));
    setForm({ ...form, categories: mapped });
  };

  const removeCategory = (index) => {
    setForm({
      ...form,
      categories: form.categories.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validCategories = form.categories
      .map((c) => ({ name: (c.name || "").trim(), allocated: Number(c.allocated || 0) }))
      .filter((c) => c.name !== "");

    const payload = {
      totalBudget: Number(form.totalBudget) || 0,
      period: form.period,
      salary: Number(form.salary) || 0,
      savingsGoal: Number(form.savingsGoal) || 0,
      categories:
        validCategories.length > 0
          ? validCategories
          : defaultCategories.map((name) => ({ name, allocated: 0 })),
    };

    createBudget(payload);
    toast.success("Budget created successfully ✅");
    setForm({
      totalBudget: "",
      period: "monthly",
      salary: "",
      savingsGoal: "",
      categories: [],
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-zinc-900 rounded-xl border border-zinc-700 shadow-lg space-y-6"
    >
      {/* Salary, Savings, Total Budget */}
      <div className="grid md:grid-cols-3 gap-4">
        <InputField label="Monthly Salary" name="salary" value={form.salary} onChange={handleChange} />
        <InputField label="Savings Goal" name="savingsGoal" value={form.savingsGoal} onChange={handleChange} />
        <InputField label="Total Budget" name="totalBudget" value={form.totalBudget} onChange={handleChange} />
      </div>

      {/* Period */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <label htmlFor="period" className="text-gray-300 font-medium">
          Budget Period
        </label>
        <select
          id="period"
          value={form.period}
          onChange={(e) => setForm({ ...form, period: e.target.value })}
          className="px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:ring-2 focus:ring-blue-500"
        >
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-semibold">Categories</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addEmptyCategory}
              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition"
            >
              + Add
            </button>
            <button
              type="button"
              onClick={addDefaultCategories}
              className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition"
            >
              Use Defaults
            </button>
          </div>
        </div>

        {form.categories.length === 0 && (
          <p className="text-gray-400 text-sm">No categories yet — click "Use Defaults" or "Add".</p>
        )}

        {form.categories.map((cat, idx) => (
          <div key={idx} className="flex gap-3 items-center">
            <input
              type="text"
              placeholder="Category"
              value={cat.name}
              onChange={(e) => handleCategoryChange(idx, "name", e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Allocated"
              value={cat.allocated}
              onChange={(e) => handleCategoryChange(idx, "allocated", e.target.value)}
              className="w-28 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeCategory(idx)}
              className="px-2 py-1 bg-red-600 hover:bg-red-500 rounded-lg text-white transition"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold shadow-lg transition disabled:opacity-50"
      >
        {loading ? "Saving..." : "Create Budget"}
      </button>
    </form>
  );
};

// Reusable Input Field
const InputField = ({ label, name, value, onChange }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="mb-1 text-gray-300 font-medium">{label}</label>
    <input
      id={name}
      name={name}
      type="number"
      placeholder={label}
      value={value}
      onChange={onChange}
      className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default BudgetForm;
