import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import axios from "axios";

const Register = () => {
  const { register, isRegistering } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    passwordHash: "",
  });

  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    try {
      await register(formData);
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ??
            "Something went wrong"
        );
      } else {
        setError("Something went wrong");
      }
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">

      <div className="w-full max-w-lg bg-surface border border-border rounded-2xl shadow-xl p-8">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-text">
            Create Account
          </h1>

          <p className="text-text-secondary mt-2">
            Join DevBoard and start building amazing projects.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-danger bg-danger/10 text-danger px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text outline-none transition focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Username
            </label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="john_doe"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text outline-none transition focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text outline-none transition focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Password
            </label>

            <input
              type="password"
              name="passwordHash"
              value={formData.passwordHash}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text outline-none transition focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={isRegistering}
            className="w-full rounded-xl bg-primary py-3 font-semibold text-background transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRegistering ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <div className="mt-8 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-link hover:underline"
          >
            Login
          </button>
        </div>

      </div>

    </div>
  );
};

export default Register;