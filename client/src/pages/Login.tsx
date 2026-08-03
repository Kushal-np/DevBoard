import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AtSign, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import apiClient from "../api/axiosConfig";

const activityGrid = [
  0.1, 0.4, 0.15, 0.6, 0.25, 0.1, 0.5, 0.2, 0.7, 0.3, 0.1, 0.4,
  0.3, 0.1, 0.5, 0.2, 0.8, 0.35, 0.15, 0.6, 0.25, 0.45, 0.2, 0.1,
  0.5, 0.65, 0.2, 0.35, 0.1, 0.55, 0.3, 0.15, 0.4, 0.75, 0.2, 0.3,
  0.15, 0.3, 0.45, 0.1, 0.6, 0.2, 0.35, 0.5, 0.1, 0.25, 0.65, 0.4,
  0.4, 0.2, 0.1, 0.55, 0.3, 0.7, 0.15, 0.45, 0.25, 0.1, 0.5, 0.2,
];

const Login = () => {
  const { login, isLogging, setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    passwordHash: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    try {
      await login(formData);
      navigate("/feed");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    }
  }

  async function handleGoogleSuccess(credentialResponse: { credential?: string }) {
    setError("");
    setIsGoogleLoading(true);
    try {
      const res = await apiClient.post("/user/google-login", {
        credential: credentialResponse.credential,
      });
      setUser(res.data.user);
      navigate("/feed");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message ?? "Google login failed");
      } else {
        setError("Google login failed");
      }
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Branding panel — hidden below lg, where the form takes the full screen */}
      <div className="relative hidden overflow-hidden border-r border-border bg-surface px-12 py-12 lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
          aria-hidden="true"
        />

        <span className="font-display text-xl font-semibold tracking-tight text-text">
          Dev<span className="text-primary">Board</span>
        </span>

        <div className="relative">
          <h1 className="max-w-sm font-display text-4xl font-semibold leading-[1.15] tracking-tight text-text">
            Good to see you again.
          </h1>
          <p className="mt-4 max-w-sm text-text-secondary">
            Pick up where you left off — your feed, your people, and your
            projects are right where you left them.
          </p>

          <div className="mt-10 grid w-fit grid-cols-12 gap-1.5" aria-hidden="true">
            {activityGrid.map((intensity, i) => (
              <div
                key={i}
                className="h-3 w-3 rounded-[3px] bg-primary"
                style={{ opacity: intensity }}
              />
            ))}
          </div>
        </div>

        <div className="relative space-y-1.5 font-mono text-xs text-text-secondary">
          <p>// pick up where you left off</p>
          <p>// see what shipped while you were gone</p>
          <p>// jump back into the conversation</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-16">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <span className="font-display text-lg font-semibold tracking-tight text-text lg:hidden">
              Dev<span className="text-primary">Board</span>
            </span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text lg:mt-0">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              New to DevBoard?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-medium text-primary hover:underline"
              >
                Create an account
              </button>
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          {/* Google sign-in — a soft card so the iframe doesn't feel bolted on */}
          <div className="relative mb-5 overflow-hidden rounded-2xl border border-border bg-surface p-3 shadow-sm transition hover:border-primary/40 hover:shadow-md">
            <div
              className={`flex justify-center transition-opacity ${
                isGoogleLoading ? "pointer-events-none opacity-40" : ""
              }`}
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google login failed")}
                theme="outline"
                shape="pill"
                size="large"
                width="368"
                text="continue_with"
                logo_alignment="center"
              />
            </div>
            {isGoogleLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-surface/80 backdrop-blur-[1px]">
                <Loader2 size={18} className="animate-spin text-primary" />
              </div>
            )}
          </div>

          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">
              Or sign in with email
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="username" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-text-secondary">
                Username
              </label>
              <div className="relative">
                <AtSign className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" size={17} strokeWidth={1.75} />
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="john_doe"
                  autoComplete="username"
                  className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wide text-text-secondary">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" size={17} strokeWidth={1.75} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="passwordHash"
                  value={formData.passwordHash}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-11 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary transition hover:text-text"
                >
                  {showPassword ? <EyeOff size={17} strokeWidth={1.75} /> : <Eye size={17} strokeWidth={1.75} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLogging}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-semibold text-on-primary transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLogging ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Log in
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;