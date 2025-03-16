import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import {
  Wallet,
  Briefcase,
  Building,
  PiggyBank,
  Gift,
  TrendingUp,
  ShoppingCart,
  Utensils,
  Car,
  Home as HomeIcon,
  Book,
  Clapperboard,
} from "lucide-react";

const incomeIcons = {
  salary: <Briefcase className="text-green-500 w-8 h-8" />,
  freelance: <Wallet className="text-green-500 w-8 h-8" />,
  investment: <TrendingUp className="text-green-500 w-8 h-8" />,
  rental: <Building className="text-green-500 w-8 h-8" />,
  pocketmoney: <PiggyBank className="text-green-500 w-8 h-8" />,
  gift: <Gift className="text-green-500 w-8 h-8" />,
};

const expenseIcons = {
  groceries: <Utensils className="text-red-500 w-8 h-8" />,
  transportation: <Car className="text-red-500 w-8 h-8" />,
  housing: <HomeIcon className="text-red-500 w-8 h-8" />,
  entertainment: <Clapperboard className="text-red-500 w-8 h-8" />,
  education: <Book className="text-red-500 w-8 h-8" />,
};

type Transaction = {
  _id: string;
  amount: number;
  date: string;
  icon?: string;
  type: "income" | "expense";
  source?: string;
  category?: string;
};

type DashboardData = {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  recentTransactions: Transaction[];
};

const Home = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET);
      if (response?.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data: ", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          Welcome to the Income & Expense Tracker!
        </h2>
        <p className="text-gray-600 mb-4">
          Manage your finances efficiently by tracking your incomes and
          expenses.
        </p>

        {loading && <p>Loading dashboard data...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {dashboardData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-100 rounded-lg">
                <h3 className="text-lg font-semibold">Total Income</h3>
                <p className="text-xl font-bold">
                  ₹{dashboardData.totalIncome}
                </p>
              </div>
              <div className="p-4 bg-red-100 rounded-lg">
                <h3 className="text-lg font-semibold">Total Expense</h3>
                <p className="text-xl font-bold">
                  ₹{dashboardData.totalExpense}
                </p>
              </div>
              <div className="p-4 bg-blue-100 rounded-lg">
                <h3 className="text-lg font-semibold">Total Balance</h3>
                <p className="text-xl font-bold">
                  ₹{dashboardData.totalBalance}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                Recent Transactions
              </h3>
              {dashboardData.recentTransactions.length === 0 ? (
                <p className="text-gray-500">No recent transactions.</p>
              ) : (
                <ul className="space-y-3">
                  {dashboardData.recentTransactions.map((transaction) => (
                    <li
                      key={transaction._id}
                      className="p-4 bg-gray-100 rounded-lg flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        {transaction.type === "income"
                          ? incomeIcons[transaction.icon || ""] || (
                              <Wallet className="text-green-500 w-8 h-8" />
                            )
                          : expenseIcons[transaction.icon || ""] || (
                              <ShoppingCart className="text-red-500 w-8 h-8" />
                            )}
                        <div>
                          <p className="text-sm text-gray-600">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                          <p className="font-medium">
                            {transaction.type === "income"
                              ? transaction.source
                              : transaction.category}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-lg font-semibold ${
                          transaction.type === "income"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}₹
                        {transaction.amount}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Home;
