import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS, getFullUrl } from "../../utils/apiPaths";
import { Wallet } from "lucide-react";

interface IncomeEntry {
  _id: string;
  source: string;
  amount: number;
  date: string;
}

const Income = () => {
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [incomes, setIncomes] = useState<IncomeEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIncomes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        getFullUrl(API_PATHS.INCOME.GET_ALL)
      );
      setIncomes(response.data);
    } catch (error) {
      console.error("Error fetching incomes:", error);
      setError("Failed to load incomes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async () => {
    if (!source || !amount) return;
    try {
      const response = await axiosInstance.post(
        getFullUrl(API_PATHS.INCOME.ADD),
        {
          source,
          amount,
        }
      );
      setIncomes([response.data.income, ...incomes]);
      setSource("");
      setAmount("");
    } catch (error) {
      console.error("Error adding income:", error);
      setError("Failed to add income. Please try again.");
    }
  };

  const handleDeleteIncome = async (id: string) => {
    try {
      await axiosInstance.delete(getFullUrl(API_PATHS.INCOME.DELETE(id)));
      setIncomes(incomes.filter((income) => income._id !== id));
    } catch (error) {
      console.error("Error deleting income:", error);
      setError("Failed to delete income. Please try again.");
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-2xl font-bold mb-4">Income</h2>
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <input
            type="text"
            placeholder="Income Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
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
            onClick={handleAddIncome}
            className="bg-purple-800 text-white px-4 py-2 rounded-lg w-full"
          >
            Add Income
          </button>
        </div>

        {loading && <p>Loading incomes...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Income List</h3>
          {incomes.length === 0 ? (
            <p className="text-gray-500">No income recorded yet.</p>
          ) : (
            <ul className="space-y-3">
              {incomes.map((income) => (
                <li
                  key={income._id}
                  className="p-4 bg-gray-100 rounded-lg flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <Wallet className="text-green-500 w-8 h-8" />
                    <div>
                      <p className="text-sm text-gray-600">
                        {new Date(income.date).toLocaleDateString()}
                      </p>
                      <p className="font-medium">{income.source}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-green-500">
                      +₹{income.amount}
                    </span>
                    <button
                      onClick={() => handleDeleteIncome(income._id)}
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

export default Income;
