import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS, getFullUrl } from "../../utils/apiPaths";
import { ShoppingCart } from "lucide-react";

interface ExpenseEntry {
  _id: string;
  category: string;
  amount: number;
  date: string;
  icon?: string;
}

const Expense = () => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        getFullUrl(API_PATHS.EXPENSE.GET_ALL)
      );
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setError("Failed to load expenses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    if (!category || !amount) return;
    try {
      const response = await axiosInstance.post(
        getFullUrl(API_PATHS.EXPENSE.ADD),
        {
          category,
          amount,
        }
      );
      setExpenses([response.data.expense, ...expenses]);
      setCategory("");
      setAmount("");
    } catch (error) {
      console.error("Error adding expense:", error);
      setError("Failed to add expense. Please try again.");
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await axiosInstance.delete(getFullUrl(API_PATHS.EXPENSE.DELETE(id)));
      setExpenses(expenses.filter((expense) => expense._id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
      setError("Failed to delete expense. Please try again.");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-2xl font-bold mb-4">Expenses</h2>
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <input
            type="text"
            placeholder="Expense Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded-lg w-full mb-3"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="border p-2 rounded-lg w-full mb-3"
          />
          <button
            onClick={handleAddExpense}
            className="bg-purple-800 text-white px-4 py-2 rounded-lg w-full"
          >
            Add Expense
          </button>
        </div>

        {loading && <p>Loading expenses...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Expense List</h3>
          {expenses.length === 0 ? (
            <p className="text-gray-500">No expenses recorded yet.</p>
          ) : (
            <ul className="space-y-3">
              {expenses.map((expense) => (
                <li
                  key={expense._id}
                  className="p-4 bg-gray-100 rounded-lg flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    {expense.icon ? (
                      <img
                        src={expense.icon}
                        alt="icon"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <ShoppingCart className="text-red-500 w-8 h-8" />
                    )}
                    <div>
                      <p className="text-sm text-gray-600">
                        {new Date(expense.date).toLocaleDateString()}
                      </p>
                      <p className="font-medium">{expense.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-red-500">
                      -₹{expense.amount}
                    </span>
                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
