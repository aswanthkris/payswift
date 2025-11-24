import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Card } from "../../components/Card";
import { LoadingOverlay } from "../../components/LoadingOverlay";

import { AuthLayout } from "../../components/AuthLayout";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your PaySwift account"
    >
      {isLoading && <LoadingOverlay message="Signing in..." />}

      <Card className="w-full shadow-none border-none bg-transparent p-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white"
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white"
          />

          <Button
            type="submit"
            className="w-full py-3 text-lg shadow-lg shadow-green-500/20"
          >
            Sign In
          </Button>
        </form>

        <p className="text-center mt-8 text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-green-600 hover:text-green-700 font-semibold hover:underline"
          >
            Create one
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
}
