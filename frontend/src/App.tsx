import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import Home from "./pages/Dashboard/Home";
import SignUp from "./pages/Auth/SignUp";
import Expense from "./pages/Dashboard/Expense";
import Income from "./pages/Dashboard/Income";
import { UserProvider } from "./context/UserProvider";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/dashboard"
              element={<PrivateRoute element={<Home />} />}
            />
            <Route
              path="/income"
              element={<PrivateRoute element={<Income />} />}
            />
            <Route
              path="/expense"
              element={<PrivateRoute element={<Expense />} />}
            />
          </Routes>
        </Router>
        <footer className="text-center text-gray-400 text-xs py-6">
          <span>
            Built with <span className="text-violet-700">💜</span> by{" "}
            <a
              href="https://personal-portfolio-wheat-kappa.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-violet-600 transition-colors"
            >
              Kishalay
            </a>
          </span>
        </footer>
      </div>
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};

const PrivateRoute = ({ element }: { element: React.ReactElement }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? element : <Navigate to="/login" />;
};
