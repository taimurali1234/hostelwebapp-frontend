import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, MapPin, Loader, Phone } from "lucide-react";
import { z } from "zod";

// Zod validation schema matching backend
const RegisterUserSchema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 chars"),
  phone: z.string().regex(/^(0\d{10}|\+?[1-9]\d{9,14})$/, "Invalid phone number"),
  address: z.string().optional()
});

type RegisterUserDTO = z.infer<typeof RegisterUserSchema>;

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();

          setForm((prev) => ({
            ...prev,
            address: data.display_name || "",
          }));
        } catch (error) {
          alert("Failed to fetch address");
        } finally {
          setLoadingLocation(false);
        }
      },
      () => {
        alert("Location permission denied");
        setLoadingLocation(false);
      }
    );
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    setFieldErrors({});
    setSuccess("");

    // Zod validation
    try {
      const validatedData: RegisterUserDTO = RegisterUserSchema.parse({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        address: form.address,
      });

      setLoading(true);

      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        setGeneralError(data.message || "Registration failed");
        return;
      }

      setSuccess("Registration successful! Please check your email to verify.");
      setForm({ name: "", email: "", password: "", phone: "", address: "" });
     
      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          const path = issue.path[0] as string;
          errors[path] = issue.message;
        });
        setFieldErrors(errors);
      } else {
        setGeneralError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-start lg:justify-center px-3 lg:px-6 py-1 lg:py-0 relative z-10 h-screen lg:h-auto overflow-y-auto lg:overflow-auto scrollbar-hide">
        <div className="w-full max-w-sm space-y-1.5 lg:space-y-2 animate-fade-in">
          {/* Header */}
          <div className="space-y-0 text-center pb-0.5">
            <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
              Get Started Now
            </h1>
            <p className="text-gray-400 text-xs lg:text-xs leading-tight">
              Join us and find your perfect hostel
            </p>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 gap-1 lg:gap-2">
            {/* Name Input */}
            <div className="space-y-0.5 group">
              <label className="text-xs font-semibold text-gray-300">
                Full Name
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'name' ? 'transform scale-105' : ''}`}>
                <div className={`absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 ${focusedField === 'name' || fieldErrors.name ? 'bg-gradient-to-r from-purple-500 to-pink-500 opacity-100' : 'bg-transparent'}`}></div>
                <div className="relative bg-slate-700 rounded-xl p-0.5">
                  <div className={`bg-slate-800 rounded-[10px] px-3 py-1.5 flex items-center gap-2 focus-within:bg-slate-700 transition-colors ${fieldErrors.name ? 'border border-red-500' : ''}`}>
                    <User size={13} className="text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-transparent text-white placeholder-gray-500 outline-none text-sm lg:text-base"
                      value={form.name}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => {
                        handleChange("name", e.target.value);
                        setFieldErrors(prev => ({ ...prev, name: "" }));
                      }}
                    />
                  </div>
                </div>
              </div>
              {fieldErrors.name && (
                <p className="text-red-400 text-xs">{fieldErrors.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-0.5 group">
              <label className="text-xs font-semibold text-gray-300">
                Email Address
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'transform scale-105' : ''}`}>
                <div className={`absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 ${focusedField === 'email' || fieldErrors.email ? 'bg-gradient-to-r from-purple-500 to-pink-500 opacity-100' : 'bg-transparent'}`}></div>
                <div className="relative bg-slate-700 rounded-xl p-0.5">
                  <div className={`bg-slate-800 rounded-[10px] px-3 py-1.5 flex items-center gap-2 focus-within:bg-slate-700 transition-colors ${fieldErrors.email ? 'border border-red-500' : ''}`}>
                    <Mail size={13} className="text-gray-400 flex-shrink-0" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full bg-transparent text-white placeholder-gray-500 outline-none text-sm lg:text-base"
                      value={form.email}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => {
                        handleChange("email", e.target.value);
                        setFieldErrors(prev => ({ ...prev, email: "" }));
                      }}
                    />
                  </div>
                </div>
              </div>
              {fieldErrors.email && (
                <p className="text-red-400 text-xs">{fieldErrors.email}</p>
              )}
            </div>

            {/* Phone Input */}
            <div className="space-y-0.5 group">
              <label className="text-xs font-semibold text-gray-300">
                Phone Number
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'phone' ? 'transform scale-105' : ''}`}>
                <div className={`absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 ${focusedField === 'phone' || fieldErrors.phone ? 'bg-gradient-to-r from-purple-500 to-pink-500 opacity-100' : 'bg-transparent'}`}></div>
                <div className="relative bg-slate-700 rounded-xl p-0.5">
                  <div className={`bg-slate-800 rounded-[10px] px-3 py-1.5 flex items-center gap-2 focus-within:bg-slate-700 transition-colors ${fieldErrors.phone ? 'border border-red-500' : ''}`}>
                    <Phone size={13} className="text-gray-400 flex-shrink-0" />
                    <input
                      type="tel"
                      placeholder="03001234567 or +923001234567"
                      className="w-full bg-transparent text-white placeholder-gray-500 outline-none text-sm lg:text-base"
                      value={form.phone}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => {
                        handleChange("phone", e.target.value);
                        setFieldErrors(prev => ({ ...prev, phone: "" }));
                      }}
                    />
                  </div>
                </div>
              </div>
              {fieldErrors.phone && (
                <p className="text-red-400 text-xs">{fieldErrors.phone}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-0.5 group">
              <label className="text-xs font-semibold text-gray-300">
                Password
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'transform scale-105' : ''}`}>
                <div className={`absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 ${focusedField === 'password' || fieldErrors.password ? 'bg-gradient-to-r from-purple-500 to-pink-500 opacity-100' : 'bg-transparent'}`}></div>
                <div className="relative bg-slate-700 rounded-xl p-0.5">
                  <div className={`bg-slate-800 rounded-[10px] px-3 py-1.5 flex items-center gap-2 focus-within:bg-slate-700 transition-colors group ${fieldErrors.password ? 'border border-red-500' : ''}`}>
                    <Lock size={13} className="text-gray-400 flex-shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full bg-transparent text-white placeholder-gray-500 outline-none text-sm lg:text-base"
                      value={form.password}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => {
                        handleChange("password", e.target.value);
                        setFieldErrors(prev => ({ ...prev, password: "" }));
                      }}
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
              {fieldErrors.password && (
                <p className="text-red-400 text-xs">{fieldErrors.password}</p>
              )}
            </div>

            {/* Address Input */}
            <div className="space-y-0.5 group">
              <label className="text-xs font-semibold text-gray-300">
                Address
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'address' ? 'transform scale-105' : ''}`}>
                <div className={`absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 ${focusedField === 'address' || fieldErrors.address ? 'bg-gradient-to-r from-purple-500 to-pink-500 opacity-100' : 'bg-transparent'}`}></div>
                <div className="relative bg-slate-700 rounded-xl p-0.5">
                  <div className={`bg-slate-800 rounded-[10px] px-3 py-1.5 flex items-center gap-2 focus-within:bg-slate-700 transition-colors ${fieldErrors.address ? 'border border-red-500' : ''}`}>
                    <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Enter your address"
                      className="w-full bg-transparent text-white placeholder-gray-500 outline-none text-sm lg:text-base"
                      value={form.address}
                      onFocus={() => setFocusedField('address')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => {
                        handleChange("address", e.target.value);
                        setFieldErrors(prev => ({ ...prev, address: "" }));
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleLocateMe}
                      disabled={loadingLocation}
                      className="text-purple-300 hover:text-purple-200 transition-colors disabled:opacity-50 flex-shrink-0 p-1"
                      title="Locate me"
                    >
                      {loadingLocation ? (
                        <Loader size={13} className="animate-spin" />
                      ) : (
                        <MapPin size={13} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              {fieldErrors.address && (
                <p className="text-red-400 text-xs">{fieldErrors.address}</p>
              )}
            </div>
          </div>

          {/* General Error Message */}
          {generalError && (
            <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/50 text-red-300 text-xs">
              {generalError}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/50 text-green-300 text-xs">
              {success}
            </div>
          )}

          {/* Signup Button */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full relative group overflow-hidden rounded-xl px-4 py-1.5 lg:py-2 font-semibold text-white text-xs lg:text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 group-hover:from-purple-500 group-hover:via-pink-500 group-hover:to-red-500 transition-all duration-300"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white"></div>
            <span className="relative flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader size={12} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create Account
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-slate-600 to-transparent"></div>
            <span className="text-xs text-gray-400">Or</span>
            <div className="flex-1 h-px bg-gradient-to-l from-slate-600 to-transparent"></div>
          </div>

          {/* Google Sign-in Button */}
          <button className="w-full flex items-center justify-center gap-2 px-4 py-1.5 rounded-xl border border-slate-600 text-white hover:bg-slate-800/50 transition-all duration-300 transform hover:scale-105 active:scale-95 text-xs">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign up with Google</span>
          </button>

          {/* Login Link */}
          <div className="text-center text-gray-400 text-xs">
            Have an account?{" "}
            <a href="/login" className="text-purple-400 hover:text-pink-400 font-semibold cursor-pointer transition-colors">
              Sign In
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
