import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, Loader } from "lucide-react";
import { z } from "zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import ForgotPasswordModal from "../../components/auth/ForgotPasswordModal";
import { loginService, resendVerificationEmail } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

// Zod validation schema
const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 chars"),
});

type LoginDTO = z.infer<typeof LoginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showResendModal, setShowResendModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [toast, setToast] = useState("");
  const {user ,setUser} = useAuth();

  useEffect(() => {
  if (!user) return;

  if (user.role === "ADMIN" || user.role === "COORDINATOR") {
    navigate("/admin/dashboard");
  } else {
    navigate("/");
  }
}, [user, navigate]);


  // Check for verification success from URL or session expiration
  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setSuccess("✅ Email verified successfully! You can now login.");
      setToast("✅ You are verified now. You can login!");
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => setToast(""), 3000);
    }

    if (searchParams.get("session") === "expired") {
      setError("❌ Your session has expired. Please login again.");
      setToast("Session expired. Please login again.");
      setTimeout(() => setToast(""), 3000);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // ✅ Zod validation
      const validatedData: LoginDTO = LoginSchema.parse({
        email: form.email,
        password: form.password,
      });

      setLoading(true);

      // Use the auth context login function
const res = await loginService(
      validatedData.email,
      validatedData.password
    );
        setUser(res.data);

      setSuccess("Login successful! Redirecting...");

      setToast("🎉 Login successful! Redirecting...");
      
    } catch (err: any) {
      // ✅ FIXED ZOD ERROR HANDLING
      if (err instanceof z.ZodError) {
        setError(err.issues[0]?.message || "Invalid input");
      } else if (err?.message?.toLowerCase().includes("verify")) {
        // Unverified email case
        setError(
          "You are not verified. Please check your email and click the verification link."
        );
        setResendEmail(form.email);
        setShowResendModal(true);
      } else {
        setError(err?.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!resendEmail) {
      setError("Email is required");
      return;
    }

    try {
      setResendLoading(true);

      const response = await resendVerificationEmail(resendEmail);
        

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to resend verification link");
        return;
      }

      setSuccess("Verification link sent! Please check your email.");
      setToast("✉️ Verification link resent to your email!");
      setShowResendModal(false);

      setTimeout(() => {
        setSuccess("");
        setToast("");
      }, 3000);
    } catch (err) {
      setError("Failed to resend verification link. Please try again.");
      console.error(err);
    } finally {
      setResendLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-y-auto lg:overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 lg:px-12 py-8 lg:py-0 relative z-10 min-h-screen lg:min-h-auto overflow-y-auto scrollbar-hide">
        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-4 left-4 right-4 lg:left-auto lg:right-auto bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-3 rounded-lg z-50 animate-pulse">
            {toast}
          </div>
        )}

        <div className="w-full max-w-md space-y-6 lg:space-y-8 animate-fade-in">
          {/* Header */}
          <div className="space-y-3">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Welcome back!
            </h1>
            <p className="text-gray-400 text-lg">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Email Input */}
          <div className="space-y-3 group">
            <label className="text-sm font-semibold text-gray-300">
              Email Address
            </label>
            <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'transform scale-105' : ''}`}>
              <div className={`absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 ${focusedField === 'email' ? 'bg-gradient-to-r from-blue-500 to-purple-500 opacity-100' : 'bg-transparent'}`}></div>
              <div className="relative bg-slate-700 rounded-xl p-0.5">
                <div className="bg-slate-800 rounded-[10px] px-4 py-3 flex items-center gap-3 focus-within:bg-slate-700 transition-colors">
                  <Mail size={20} className="text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-white placeholder-gray-500 outline-none text-base"
                    value={form.email}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-300">
              Password
            </label>
            <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'transform scale-105' : ''}`}>
              <div className={`absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 ${focusedField === 'password' ? 'bg-gradient-to-r from-blue-500 to-purple-500 opacity-100' : 'bg-transparent'}`}></div>
              <div className="relative bg-slate-700 rounded-xl p-0.5">
                <div className="bg-slate-800 rounded-[10px] px-4 py-3 flex items-center gap-3 focus-within:bg-slate-700 transition-colors group">
                  <Lock size={20} className="text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-white placeholder-gray-500 outline-none text-base"
                    value={form.password}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, password: e.target.value }))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setShowForgotPasswordModal(true);
              }}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Forgot password?
            </a>
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/50 text-green-300 text-sm">
              {success}
            </div>
          )}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full relative group overflow-hidden rounded-xl px-6 py-4 font-semibold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-pink-500 transition-all duration-300"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white"></div>
            <span className="relative flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Login Now
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </span>
          </button>

          {/* Signup Link */}
          <div className="text-center text-gray-400">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer transition-colors">
              Sign Up
            </a>
          </div>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden max-h-screen">
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-slate-900 z-10"></div>
        <div className="relative w-full h-full overflow-hidden">
          <img
            src="/public/assets/vila.png"
            alt="Villa"
            className="h-full w-full object-cover scale-110 hover:scale-120 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-50"></div>
        </div>
      </div>

      {/* Resend Verification Modal */}
      {showResendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Resend Verification Link</h2>
            
            <p className="text-gray-400 mb-4">
              Enter your email address and we'll send you a new verification link.
            </p>

            <input
              type="email"
              placeholder="your@email.com"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg mb-4 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {error && (
              <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/50 text-red-300 text-sm mb-4">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowResendModal(false);
                  setError("");
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-600 text-gray-400 hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleResendVerification}
                disabled={resendLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {resendLoading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Link"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <ForgotPasswordModal 
          isOpen={showForgotPasswordModal}
          onClose={() => setShowForgotPasswordModal(false)}
        />
      )}

      {/* Styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
