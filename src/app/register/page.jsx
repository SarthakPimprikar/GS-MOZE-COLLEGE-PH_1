"use client";
import React, { useState } from "react";
import { User, Lock, Mail, Phone, Building, Eye, EyeOff } from "lucide-react";

const page = () => {
  const [selectedRole, setSelectedRole] = useState("Staff");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* const handleSubmit = async () => {
    console.log("Signup data:", { ...formData, role: selectedRole });
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          agreeToTerms: formData.agreeToTerms,
          role: selectedRole.toLowerCase(),
        }),
      });

      const data = await res.json();
      console.log(data);
      
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert("Registration successful! Please log in.");
      // Optional: redirect to login
      window.location.href = "/login";
    } catch (err) {
      alert(err.message);
      console.error("Registration error:", err);
    }
  };  */

  // src/app/register/page.jsx
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!name || !email || !password || !role) {
    alert("All fields are required");
    return;
  }

  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  alert("Registration successful! Please log in.");
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 p-4">
      {/* Left Side - Logo and Branding */}
      <div className="hidden lg:flex lg:w-1/2 justify-center items-center">
        <div className="bg-white rounded-3xl p-12 shadow-2xl max-w-md">
          {/* Logo Design */}
          <div className="relative mb-8 flex justify-center">
            <div className="relative">
              {/* Main blue rectangle */}
              <div className="w-32 h-20 bg-blue-600 rounded-lg relative">
                {/* Yellow squares */}
                <div className="absolute top-2 left-2 w-4 h-4 bg-yellow-400 rounded-sm"></div>
                <div className="absolute top-2 right-2 w-4 h-4 bg-yellow-400 rounded-sm"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 bg-yellow-400 rounded-sm"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-yellow-400 rounded-sm"></div>
                {/* Orange center square */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-orange-500 rounded-sm"></div>
              </div>

              {/* Bottom shapes */}
              <div className="flex justify-center mt-4 space-x-2">
                <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
                <div className="w-8 h-8 bg-pink-500 rounded-full"></div>
                <div className="w-8 h-6 bg-gray-800 rounded-sm"></div>
                <div className="w-6 h-8 bg-blue-500 rounded-sm"></div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-6 w-8 h-8 bg-purple-200 rounded-lg transform rotate-12"></div>
              <div className="absolute -bottom-2 -left-4 w-6 h-6 bg-pink-200 rounded-lg transform -rotate-12"></div>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              SchoolERP Pro
            </h1>
            <p className="text-gray-600 text-lg">
              Smart, Efficient, Comprehensive School Management System
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">Join our school management system</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <p className="text-gray-700 font-medium mb-4">Select your role</p>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setSelectedRole("Admin")}
                className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                  selectedRole === "Admin"
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                }`}
              >
                <Building className="w-6 h-6" />
                <span className="font-medium">Admin</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("Staff")}
                className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                  selectedRole === "Staff"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                }`}
              >
                <User className="w-6 h-6" />
                <span className="font-medium">Staff</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                required
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="agreeToTerms"
                id="terms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!formData.agreeToTerms}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Create Account →
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Log In
            </a>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            Need help?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Contact IT Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;