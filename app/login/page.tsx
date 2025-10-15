"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("🔄 Starting login process...");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("📡 Login response status:", res.status);

      if (res.ok) {
        const data = await res.json();
        console.log("✅ Login successful, data:", data);

        // Save login info
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", data.role?.toUpperCase());
        localStorage.setItem("userEmail", email); // ADDED THIS LINE - store user email for API auth

        // Debug: Check what's stored
        console.log("💾 Stored isLoggedIn:", localStorage.getItem("isLoggedIn"));
        console.log("💾 Stored role:", localStorage.getItem("role"));
        console.log("💾 Stored userEmail:", localStorage.getItem("userEmail")); // ADDED THIS LINE

        // ✅ Role-based redirect
        const userRole = data.role?.toLowerCase();
        console.log("🎯 User role for redirect:", userRole);
        
        if (userRole === "admin") {
          console.log("🚀 Redirecting to ADMIN page");
          router.push("/admin");
        } else {
          console.log("🏠 Redirecting to HOME page");
          router.push("/");
        }
      } else {
        const errorData = await res.json();
        console.log("❌ Login failed:", errorData);
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      alert("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 pt-20"> {/* Added pt-20 for top padding */}
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
      
      <div className="relative w-full max-w-md mt-8"> {/* Added mt-8 for more spacing */}
        {/* Glass Card */}
        <div className="glass-effect rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-foreground">SM</span>
            </div>
            <h1 className="heading-lg mb-2">Santa Maria Municipality</h1>
            <p className="text-muted-foreground">
              Your trusted source for government announcements, transparency reports, and community updates.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Email Address</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-glass-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Password</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-glass-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-primary hover:text-primary-dark font-semibold transition-colors duration-200 hover:underline"
                >
                  Create account
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            © 2024 Santa Maria Municipal Government. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}