import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Link, Navigate, Outlet } from "react-router-dom";
import { FiHome, FiFolder, FiLogOut, FiPlus } from "react-icons/fi";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SessionWorkspace from "./pages/SessionWorkspace";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<SharedLayout />}>
        {/* Protected Routes */}
        <Route index element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="session/:id" element={<PrivateRoute><SessionWorkspace /></PrivateRoute>} />
      </Route>
    </Routes>
  );
}

function SharedLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = !!localStorage.getItem("token"); // Simple check

  // If on login/register, don't show layout (though Routes handles this separation usually)
  if (["/login", "/register"].includes(location.pathname)) {
    return <Outlet />;
  }

  // Redirect if not auth is now handled by PrivateRoute for inner routes,
  // but SharedLayout wraps them.
  // Actually, if we are at `/`, SharedLayout renders.
  // PrivateRoute protects the specific route.

  return (
    <div className="layout">
      <nav className="sidebar">
        <h1 className="text-xl font-bold mb-8 text-primary" style={{ color: 'var(--primary)' }}>KnowledgeHub</h1>
        <div className="flex flex-col gap-2">
          <Link to="/" className={`btn justify-start ${location.pathname === '/' ? 'btn-primary' : ''}`}>
            <FiHome className="mr-2" /> Dashboard
          </Link>
        </div>
        <div className="mt-auto">
          <button onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }} className="btn justify-start w-full text-red-500">
            <FiLogOut className="mr-2" /> Logout
          </button>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
