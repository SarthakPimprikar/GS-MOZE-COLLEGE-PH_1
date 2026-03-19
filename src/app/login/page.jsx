"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Settings,
  ArrowRight,
  Database,
  Shield,
  Briefcase,
  ClipboardList,
  BookOpen,
  GraduationCap,
  UsersRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";

const Login = () => {
  const router = useRouter();
  const { login } = useSession();

  const [selectedRole, setSelectedRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Dynamic Roles State
  const [availableRoles, setAvailableRoles] = useState([
    { role: "admin", label: "Admin", icon: Settings },
    { role: "superadmin", label: "Super Admin", icon: Shield },
    { role: "hod", label: "HOD", icon: Briefcase },
    { role: "staff", label: "Staff", icon: ClipboardList },
    { role: "teacher", label: "Teacher", icon: BookOpen },
    { role: "student", label: "Student", icon: GraduationCap },
    { role: "hr", label: "HR", icon: UsersRound },
    { role: "accountant", label: "Accountant", icon: Database },
  ]);

  const ROLE_ICONS_MAP = {
    admin: Settings,
    superadmin: Shield,
    hod: Briefcase,
    staff: ClipboardList,
    teacher: BookOpen,
    student: GraduationCap,
    hr: UsersRound,
    accountant: Database,
  };

  const PRIORITY_ORDER = ["admin", "superadmin", "hod", "staff", "teacher", "student", "hr", "accountant"];

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch('/api/admin/roles');
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          const sortedData = [...data.data].reverse();
          const formattedRoles = sortedData.map(r => {
            const normalizedName = r.name.toLowerCase();
            const Icon = ROLE_ICONS_MAP[normalizedName] || Shield;
            return {
              role: normalizedName,
              label: r.name,
              icon: Icon
            };
          });

          formattedRoles.sort((a, b) => {
            const indexA = PRIORITY_ORDER.indexOf(a.role);
            const indexB = PRIORITY_ORDER.indexOf(b.role);
            const rankA = indexA === -1 ? Infinity : indexA;
            const rankB = indexB === -1 ? Infinity : indexB;
            return rankA - rankB;
          });

          if (formattedRoles.length > 0) {
            setAvailableRoles(formattedRoles);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic roles:", err);
      }
    };
    fetchRoles();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(email, password, selectedRole);
      if (!result.success) {
        setError(result.message || "Login failed");
        setLoading(false); 
      }
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-moze-secondary">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-moze-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-800 font-medium">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-moze-secondary flex overflow-hidden font-sans">
      {/* LEFT SIDE (Brand Presentation) */}
      <div className="hidden lg:flex lg:w-1/2 bg-moze-primary relative items-center justify-center overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-maroon-900 to-transparent opacity-80 z-0"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl z-0"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl z-0"></div>

        <div className="relative z-10 max-w-md text-center px-10">
          <div className="mb-10 inline-flex items-center justify-center">
            <div className="bg-white p-4 rounded-2xl text-moze-primary shadow-2xl flex flex-col items-center">
              <GraduationCap className="w-16 h-16 mb-2 text-moze-primary" strokeWidth={1.5} />
              <div className="flex flex-col text-center">
                <span className="font-serif font-bold text-3xl text-gray-900 leading-tight">G.S. Moze</span>
                <span className="text-sm font-bold text-yellow-500 tracking-widest uppercase mt-1">College</span>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-serif font-bold text-white mb-6 leading-tight">
            Institutional <br />
            <span className="text-yellow-400">ERP Portal</span>
          </h1>
          <p className="text-maroon-100 text-lg mx-auto max-w-sm">
            Access your academic dashboard, manage records, and stay connected with the digital campus.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE (Login Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white shadow-[-20px_0_40px_rgba(0,0,0,0.05)] z-10 rounded-l-[2rem] lg:rounded-l-[3rem]">
        <div className="w-full max-w-md px-4 sm:px-10">
          <div className="text-center mb-8">
            <div className="lg:hidden inline-flex items-center gap-2 mb-6 bg-maroon-50 px-4 py-2 rounded-xl">
              <GraduationCap className="w-6 h-6 text-moze-primary" />
              <span className="font-serif font-bold text-xl text-moze-primary">G.S. Moze College</span>
            </div>
            
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-500 font-medium">
              Sign in to your authorized account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 mb-2">
              {availableRoles.filter((_, idx) => idx < 8).map(({ role, label, icon: Icon }) => (
                <button
                  key={role}
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setSelectedRole(role)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    selectedRole === role
                    ? "border-moze-primary bg-moze-primary text-white shadow-md transform -translate-y-0.5"
                    : "border-gray-100 bg-gray-50 text-gray-500 hover:bg-maroon-50 hover:text-moze-primary"
                    }`}
                >
                  <Icon className="w-5 h-5 mb-1.5" strokeWidth={selectedRole === role ? 2.5 : 1.5} />
                  <span className="text-[10px] sm:text-xs font-semibold tracking-wide uppercase truncate w-full text-center">{label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email or Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    suppressHydrationWarning
                    placeholder="Enter your credentials"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-moze-primary focus:border-moze-primary outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    suppressHydrationWarning
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-moze-primary focus:border-moze-primary outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-moze-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <a href="/forgot-password" className="text-sm font-semibold text-moze-primary hover:text-maroon-800 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              suppressHydrationWarning
              disabled={loading}
              className={`w-full py-4 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all ${
                loading ? "bg-maroon-800 opacity-70 cursor-not-allowed" : "bg-moze-primary hover:bg-maroon-800 hover:shadow-xl hover:-translate-y-0.5"
              }`}
            >
              Sign In to Portal <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
