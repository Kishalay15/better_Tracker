import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { getInitials } from "../../utils/helper";
import { LayoutDashboard, Wallet, CreditCard } from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
  { name: "Income", path: "/income", icon: <Wallet size={20} /> },
  { name: "Expense", path: "/expense", icon: <CreditCard size={20} /> },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("DashboardLayout must be used within a UserProvider.");
  }

  const { user, clearUser } = userContext;

  const handleLogout = () => {
    clearUser();
    navigate("/login");
    console.log("Logging out...");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* Navbar */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="text-gray-600 hover:text-purple-500 focus:outline-none"
          >
            ☰
          </button>
          <h1 className="text-xl font-bold text-purple-600">Expense Tracker</h1>
        </div>
        <button
          onClick={handleLogout}
          className="text-red-500 hover:bg-red-100 px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`$${
            sidebarOpen ? "w-64" : "w-16"
          } bg-white shadow-lg transition-all duration-300 ease-in-out`}
        >
          <nav className="p-4">
            {/* User Avatar */}
            {sidebarOpen && user && (
              <div className="mb-6 flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                  {getInitials(user.name)}
                </div>
                <span className="text-gray-700 font-semibold">{user.name}</span>
              </div>
            )}

            <ul>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.name} className="mb-3">
                    <Link to={item.path}>
                      <span
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                          isActive
                            ? "bg-purple-500 text-white"
                            : "hover:bg-purple-100 text-gray-800"
                        }`}
                      >
                        <span className="mr-3">{item.icon}</span>
                        {sidebarOpen && item.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
