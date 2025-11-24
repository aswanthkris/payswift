import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Layout } from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth Pages
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import KYC from "./pages/Auth/KYC";

// Dashboard Pages
import Home from "./pages/Dashboard/Home";
import AddMoney from "./pages/Dashboard/AddMoney";
import Transfer from "./pages/Dashboard/Transfer";
import Services from "./pages/Services/Services";
import History from "./pages/History/History";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
          },
          success: {
            style: {
              background: "#ecfdf5",
              color: "#15803d",
              border: "1px solid #bbf7d0",
            },
          },
          error: {
            style: {
              background: "#fef2f2",
              color: "#b91c1c",
              border: "1px solid #fecaca",
            },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/kyc" element={<KYC />} />
          <Route path="/add-money" element={<AddMoney />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/services" element={<Services />} />
          <Route path="/history" element={<History />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
