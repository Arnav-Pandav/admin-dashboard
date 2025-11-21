import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import users from "../data/users.json";
import { Sun, Moon } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  // 🌗 Theme sync
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // 🔁 Auto redirect if user already logged in
  useEffect(() => {
    const user = localStorage.getItem("loggedInUser") || sessionStorage.getItem("loggedInUser");
    if (user) navigate("/dashboard");
  }, [navigate]);

  // 🔐 Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password.trim()
    );

    if (user) {
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("loggedInUser", JSON.stringify(user));
      navigate("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div
      className={`${
        dark ? "dark" : ""
      } min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#1f2335] transition-colors`}
    >
      {/* 🌗 Theme Toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDark((d) => !d)}
          className="p-2 rounded-lg bg-gray-200 dark:bg-[#2a2f45] hover:opacity-80 transition"
        >
          {dark ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-700" />
          )}
        </button>
      </div>

      {/* ✨ Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/70 dark:bg-[#2a2f45]/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 ring-1 ring-gray-200 dark:ring-[#3b4261]"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-[#e0e6f0]">
          Webworks Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-[#a1accd]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-[#1f2335] border border-gray-300 dark:border-[#3b4261] text-gray-900 dark:text-[#e0e6f0] outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-[#a1accd]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-[#1f2335] border border-gray-300 dark:border-[#3b4261] text-gray-900 dark:text-[#e0e6f0] outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-[#a1accd]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe((prev) => !prev)}
                className="w-4 h-4 rounded border-gray-400 dark:border-[#3b4261]"
              />
              Remember Me
            </label>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-xs mt-6 text-gray-500 dark:text-[#a1accd]">
          © 2025 Webworks by Arnav
        </p>
      </motion.div>
    </div>
  );
}
