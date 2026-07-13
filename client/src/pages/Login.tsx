import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, isLogging } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
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
      await login(formData);

      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
          "Something went wrong"
        );
      } else {
        setError("Something went wrong");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">

      <div className="
        w-full max-w-md
        bg-surface
        border border-border
        rounded-2xl
        p-8
        shadow-xl
      ">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="
            text-3xl
            font-bold
            text-text
          ">
            Welcome Back
          </h1>

          <p className="
            mt-2
            text-text-secondary
          ">
            Login to continue to your account
          </p>
        </div>


        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {error && (
            <div className="
              bg-danger/10
              text-danger
              border
              border-danger
              rounded-lg
              px-4
              py-3
              text-sm
            ">
              {error}
            </div>
          )}


          {/* Username */}
          <div>
            <label className="
              block
              text-sm
              font-medium
              text-text
              mb-2
            ">
              Username
            </label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="
                w-full
                px-4
                py-3
                rounded-xl
                bg-background
                border
                border-border
                text-text
                placeholder:text-text-secondary
                outline-none
                focus:border-primary
                transition
              "
            />
          </div>


          {/* Password */}
          <div>
            <label className="
              block
              text-sm
              font-medium
              text-text
              mb-2
            ">
              Password
            </label>

            <input
              type="password"
              name="passwordHash"
              value={formData.passwordHash}
              onChange={handleChange}
              placeholder="Enter your password"
              className="
                w-full
                px-4
                py-3
                rounded-xl
                bg-background
                border
                border-border
                text-text
                placeholder:text-text-secondary
                outline-none
                focus:border-primary
                transition
              "
            />
          </div>


          {/* Button */}
          <button
            type="submit"
            disabled={isLogging}
            className="
              w-full
              py-3
              rounded-xl
              bg-primary
              text-background
              font-semibold
              hover:bg-primary-hover
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {isLogging ? "Logging in..." : "Login"}
          </button>

        </form>


        <p className="
          text-center
          text-sm
          text-text-secondary
          mt-6
        ">
          Don't have an account?{" "}
          <span className="
            text-link
            cursor-pointer
            hover:underline
          "
          onClick={()=> navigate("/register")}
          >
            Register
          </span>
        </p>

      </div>

    </div>
  );
};

export default Login;