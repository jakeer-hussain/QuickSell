import React, { createContext, useState, useEffect } from "react";
import authService from "../services/authService";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Sync token to api client and localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      // Fetch user profile if not loaded
      authService.getMe()
        .then((res) => {
          setUser(res);
          setError("");
        })
        .catch((err) => {
          console.error("Failed to fetch user, logging out", err);
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    setError("");
    try {
      const data = await authService.login(email, password);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Login failed";
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const register = async (name, email, password) => {
    setError("");
    try {
      const data = await authService.register(name, email, password);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Registration failed";
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
    setError("");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
