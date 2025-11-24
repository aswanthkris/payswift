import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Card } from "../../components/Card";
import { LoadingOverlay } from "../../components/LoadingOverlay";

import { AuthLayout } from "../../components/AuthLayout";
import toast from "react-hot-toast";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { signup, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      toast.success("Account created successfully!");
      navigate("/kyc");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join PaySwift today and start transacting"
    >
      {isLoading && <LoadingOverlay message="Creating account..." />}

      <Card className="w-full shadow-none border-none bg-transparent p-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            className="bg-white"
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            className="bg-white"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="bg-white"
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="bg-white"
          />

          <Button
            type="submit"
            className="w-full py-3 mt-4 text-lg shadow-lg shadow-green-500/20"
          >
            Sign Up
          </Button>
        </form>

        <p className="text-center mt-8 text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 hover:text-green-700 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
}
