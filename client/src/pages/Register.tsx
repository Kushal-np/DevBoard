// Register.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff,
  Code,
  AlertCircle,
  CheckCircle,
  Shield,
  Check,
  X
} from "lucide-react";
import { useTheme } from "../theme/useTheme";

interface RegisterProps {
  onRegister?: (data: { 
    name: string; 
    username: string; 
    email: string; 
    password: string;
  }) => void;
  onSwitchToLogin?: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onSwitchToLogin }) => {
  const { themeName } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Check password strength when password changes
    if (name === "password") {
      setPasswordStrength({
        hasMinLength: value.length >= 8,
        hasUppercase: /[A-Z]/.test(value),
        hasLowercase: /[a-z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasSpecial: /[^A-Za-z0-9]/.test(value),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validate
    if (!formData.name || !formData.username || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!acceptedTerms) {
      setError("Please accept the Terms of Service");
      return;
    }

    // Check password strength
    const { hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial } = passwordStrength;
    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      setError("Password does not meet all requirements");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      if (onRegister) {
        onRegister(formData);
      }
      console.log("Registration attempt:", formData);
      
      // Reset form after success
      setTimeout(() => {
        setSuccess(false);
        if (onSwitchToLogin) {
          onSwitchToLogin();
        }
      }, 2000);
    }, 1500);
  };

  const getPasswordStrengthScore = () => {
    const { hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial } = passwordStrength;
    const score = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
    return score;
  };

  const getPasswordStrengthText = () => {
    const score = getPasswordStrengthScore();
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak";
    if (score <= 3) return "Fair";
    if (score <= 4) return "Good";
    return "Strong";
  };

  const getPasswordStrengthColor = () => {
    const score = getPasswordStrengthScore();
    if (score === 0) return "bg-border";
    if (score <= 2) return "bg-danger";
    if (score <= 3) return "bg-warning";
    if (score <= 4) return "bg-link";
    return "bg-success";
  };

  return (
    <div className="min-h-screen bg-background text-text flex items-center justify-center px-4 py-12">
      {/* Background Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <motion.div 
            className="inline-flex items-center gap-3 mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-xl blur-lg" />
              <div className="relative w-12 h-12 border border-border rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-text" strokeWidth={1.5} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-light text-2xl text-text tracking-tight">dev</span>
              <span className="text-secondary text-2xl font-light">/</span>
              <span className="text-lg text-secondary font-mono tracking-wider">community</span>
            </div>
          </motion.div>
          <h1 className="text-2xl font-light text-text">Create account</h1>
          <p className="text-secondary text-sm mt-1">Join the developer community</p>
        </div>

        {/* Register Form */}
        <motion.div 
          className="bg-surface/50 backdrop-blur-xl border border-border rounded-2xl p-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-mono tracking-wider text-secondary mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:border-primary/20 focus:ring-1 focus:ring-primary/20 text-text placeholder:text-secondary text-sm transition-all duration-300"
                  placeholder="John Doe"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-mono tracking-wider text-secondary mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
                  <Shield className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:border-primary/20 focus:ring-1 focus:ring-primary/20 text-text placeholder:text-secondary text-sm transition-all duration-300"
                  placeholder="johndoe"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-mono tracking-wider text-secondary mb-1.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:border-primary/20 focus:ring-1 focus:ring-primary/20 text-text placeholder:text-secondary text-sm transition-all duration-300"
                  placeholder="john@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-mono tracking-wider text-secondary mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:border-primary/20 focus:ring-1 focus:ring-primary/20 text-text placeholder:text-secondary text-sm transition-all duration-300"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-text transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(getPasswordStrengthScore() / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-secondary ml-2">
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px]">
                    {[
                      { key: 'hasMinLength', label: '8+ characters' },
                      { key: 'hasUppercase', label: 'Uppercase' },
                      { key: 'hasLowercase', label: 'Lowercase' },
                      { key: 'hasNumber', label: 'Number' },
                      { key: 'hasSpecial', label: 'Special char' },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-1.5">
                        {passwordStrength[key as keyof typeof passwordStrength] ? (
                          <Check className="w-3 h-3 text-success" />
                        ) : (
                          <X className="w-3 h-3 text-secondary/40" />
                        )}
                        <span className={`text-[10px] ${
                          passwordStrength[key as keyof typeof passwordStrength] 
                            ? 'text-text' 
                            : 'text-secondary/40'
                        }`}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-mono tracking-wider text-secondary mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:border-primary/20 focus:ring-1 focus:ring-primary/20 text-text placeholder:text-secondary text-sm transition-all duration-300"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-text transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-danger mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <label className="flex items-center gap-2 text-sm text-secondary cursor-pointer group">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 border rounded transition-all duration-200 ${
                    acceptedTerms 
                      ? 'bg-primary border-primary' 
                      : 'border-border bg-transparent group-hover:border-primary/30'
                  }`}>
                    {acceptedTerms && (
                      <CheckCircle className="w-4 h-4 text-background" />
                    )}
                  </div>
                </div>
                <span>I agree to the Terms of Service and Privacy Policy</span>
              </label>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  className="flex items-center gap-2 text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg px-4 py-2.5"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
              {success && (
                <motion.div 
                  className="flex items-center gap-2 text-sm text-success bg-success/10 border border-success/20 rounded-lg px-4 py-2.5"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Account created successfully! Redirecting...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-primary text-background rounded-xl font-medium text-sm hover:bg-primaryHover transition-all duration-300 shadow-lg shadow-primary/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  <span>Creating account...</span>
                </div>
              ) : (
                <>
                  <span>Create account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-surface/50 text-secondary font-mono tracking-wider">OR</span>
            </div>
          </div>

          {/* Switch to Login */}
          <div className="text-center">
            <p className="text-sm text-secondary">
              Already have an account?{" "}
              <button
                onClick={onSwitchToLogin}
                className="text-text hover:text-primary transition-colors font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-xs text-secondary/60 mt-6 font-mono tracking-wider">
          Join thousands of developers building the future
        </p>
      </motion.div>
    </div>
  );
};

export default Register;