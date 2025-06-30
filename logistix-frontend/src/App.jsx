// src/App.jsx
import { Route, Routes } from "react-router-dom";
import LoginAdmin from "./pages/auth/LoginAdmin";
import LoginChoice from "./pages/auth/LoginChoice";
import LoginUser from "./pages/auth/LoginUser";
import Dashboard from "./pages/dashboard/Dashboard";
import OrdersPage from "./pages/orders/OrdersPage";
import ProductsPage from "./pages/products/ProductsPage";
import StatsPage from "./pages/stats/StatsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginChoice />} />
      <Route path="/login/admin" element={<LoginAdmin />} />
      <Route path="/login/user" element={<LoginUser />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/stats/*" element={<StatsPage />} />
      <Route path="/orders/*" element={<OrdersPage />} />
    </Routes>
  );
}
