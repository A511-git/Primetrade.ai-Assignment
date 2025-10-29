import React, { useState, useEffect, useCallback, createContext } from "react";
import { apiFetch } from "../services/api";

// --- AUTH CONTEXT ---
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("login"); // 'login', 'register', 'dashboard', 'admin'
  const [message, setMessage] = useState(null);

  const isAdmin = user && user.role === "ADMIN";

  // ✅ Debug helper
  const logState = (label) => {
    console.log(`🪵 [AuthContext] ${label}`, {
      isLoggedIn,
      user,
      view,
      loading,
      message,
    });
  };

  const handleMessage = (msg) => {
    if (msg.type === "clear") {
      setMessage(null);
    } else {
      setMessage(msg);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const checkAuthStatus = useCallback(async () => {
    console.log("🔍 Checking current user authentication status...");
    try {
      const result = await apiFetch("/users/current-user");
      console.log("✅ Auth check result:", result);

      if (result.success && result.data) {
        console.log("🎯 User authenticated:", result.data);
        if (!isLoggedIn) {
          const nextView =
            result.data.role === "ADMIN" ? "admin" : "dashboard";
          console.log(`🔄 Setting view to '${nextView}'`);
          setView(nextView);
        }
        setIsLoggedIn(true);
        setUser(result.data);
      } else {
        console.log("❌ Auth check failed — no valid user found.");
        setIsLoggedIn(false);
        setUser(null);
        if (view !== "register") setView("login");
      }
    } catch (error) {
      console.error("🚨 Auth check error:", error);
      setIsLoggedIn(false);
      setUser(null);
      if (view !== "register") setView("login");
    } finally {
      setLoading(false);
      logState("After checkAuthStatus");
    }
  }, [view, isLoggedIn]);

  const handleAuthSuccess = async () => {
    console.log("✅ Login/Register success — verifying session...");
    setLoading(true);
    await checkAuthStatus();
    console.log("✅ Auth check completed — moving to dashboard view");
    setView("dashboard");
    logState("After handleAuthSuccess");
  };

  const handleLogout = async () => {
    console.log("🔒 Logging out...");
    try {
      await apiFetch("/users/logout", { method: "POST" });
      handleMessage({ type: "success", text: "Logged out successfully." });
      console.log("✅ Logout successful");
    } catch (error) {
      handleMessage({ type: "error", text: "Logout failed." });
      console.error("🚨 Logout failed:", error);
    } finally {
      setIsLoggedIn(false);
      setUser(null);
      setView("login");
      logState("After handleLogout");
    }
  };

  useEffect(() => {
    console.log("⚡ useEffect triggered — checking auth status...");
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    logState("State changed");
  }, [isLoggedIn, user, view, loading]);

  const contextValue = {
    isLoggedIn,
    user,
    isAdmin,
    loading,
    view,
    setView,
    handleAuthSuccess,
    handleLogout,
    handleMessage,
    message,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
