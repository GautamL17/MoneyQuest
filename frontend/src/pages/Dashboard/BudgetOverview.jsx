// src/components/BudgetOverview.jsx
import useBudgetStore from "../../store/useBudgetStore";
import { format } from "date-fns";
import toast from "react-hot-toast";

const BudgetOverview = ({ budgets }) => {
  const { deleteBudget } = useBudgetStore();

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this budget?")) {
      try {
        await deleteBudget(id);
        toast.success("Budget deleted successfully ✅");
      } catch (err) {
        toast.error("Failed to delete budget ❌");
      }
    }
  };

  if (!budgets || budgets.length === 0) {
    return <p className="text-gray-400">No budgets available yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {budgets.map((budget) => (
        <div
          key={budget._id}
          className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl p-6 flex flex-col space-y-4 transition hover:scale-[1.01]"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-white">
                {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} Budget
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Created: {budget.createdAt ? format(new Date(budget.createdAt), "dd MMM yyyy") : "N/A"}
              </p>
            </div>
            <button
              onClick={() => handleDelete(budget._id)}
              className="p-2 bg-red-600 rounded-lg hover:bg-red-500 text-white transition"
            >
              Delete
            </button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 text-center py-2 bg-zinc-800 rounded-lg border border-zinc-700">
            <div>
              <p className="text-sm text-gray-400">Total</p>
              <p className="font-bold text-white">₹{budget.totalBudget}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Spent</p>
              <p className="font-bold text-red-400">₹{budget.totalSpent}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Remaining</p>
              <p className="font-bold text-green-400">₹{budget.remaining}</p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-2">Categories</h4>
            <ul className="space-y-1 text-sm text-gray-300 max-h-32 overflow-y-auto">
              {budget.categories.map((c, idx) => (
                <li key={idx} className="flex justify-between border-b border-zinc-700 py-1">
                  <span>{c.name}</span>
                  <span>
                    ₹{c.spent} / ₹{c.allocated}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Transactions */}
          {budget.transactions && budget.transactions.length > 0 && (
            <div>
              <h4 className="text-white font-semibold mb-2 mt-2">Transactions</h4>
              <ul className="space-y-1 text-sm text-gray-300 max-h-40 overflow-y-auto">
                {budget.transactions
                  .slice()
                  .reverse()
                  .map((t, idx) => (
                    <li key={idx} className="flex justify-between border-b border-zinc-700 py-1">
                      <div>
                        <p className="font-medium">{t.category}</p>
                        <p className="text-xs text-gray-400">{t.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-red-400">-₹{t.amount}</p>
                        <p className="text-xs text-gray-500">
                          {t.createdAt ? format(new Date(t.createdAt), "dd MMM") : "N/A"}
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BudgetOverview;
