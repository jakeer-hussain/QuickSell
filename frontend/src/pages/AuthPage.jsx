import React, { useState, useContext } from "react";
import { Mail, Lock, UserPlus, Sparkles, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AuthPage({ triggerToast = () => {} }) {
  const navigate = useNavigate();
  const { login, register, error, setError } = useContext(AuthContext);
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      triggerToast("Please fill in email and password! ⚠️");
      return;
    }
    if (!isLoginTab && !name.trim()) {
      triggerToast("Please enter your name! ⚠️");
      return;
    }

    try {
      setActionLoading(true);
      if (isLoginTab) {
        await login(email, password);
        triggerToast("Logged in successfully! Welcome back 👤");
      } else {
        await register(name, email, password);
        triggerToast("Account registered successfully! Welcome 🚀");
      }
      navigate("/");
    } catch (err) {
      console.error("Auth action failed:", err);
      triggerToast(err.message || "Authentication failed. ⚠️");
    } finally {
      setActionLoading(false);
    }
  };

  const handleTabChange = (isLogin) => {
    setIsLoginTab(isLogin);
    setError("");
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      
      {/* Claymorphic Registration Form */}
      <div className="clay-card p-8 bg-white space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-tr from-pink-400 to-indigo-400 rounded-2xl flex items-center justify-center border-2 border-white shadow-md mx-auto transform rotate-3">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-black text-slate-800">Welcome to ReSeller</h3>
          <p className="text-xs text-slate-500 font-semibold">Join thousands of collectors exchanging items in aesthetic style!</p>
        </div>

        {/* Toggle Sub-tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button 
            type="button"
            onClick={() => handleTabChange(true)}
            className={`py-2.5 text-xs font-black rounded-xl cursor-pointer transition-all ${
              isLoginTab 
                ? "bg-white text-indigo-600 shadow-sm border border-slate-100" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            🔓 Log In
          </button>
          <button 
            type="button"
            onClick={() => handleTabChange(false)}
            className={`py-2.5 text-xs font-black rounded-xl cursor-pointer transition-all ${
              !isLoginTab 
                ? "bg-white text-indigo-600 shadow-sm border border-slate-100" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            📝 Register Account
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-bold text-center">
            {error}
          </div>
        )}

        {/* Forms inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginTab && (
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" /> Full Name
              </label>
              <input 
                type="text" 
                placeholder="e.g., Alex Rivera" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={actionLoading}
                className="w-full px-4 py-3 clay-input text-sm font-semibold"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
            </label>
            <input 
              type="email" 
              placeholder="e.g., alex@reseller.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={actionLoading}
              className="w-full px-4 py-3 clay-input text-sm font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" /> Secure Password
            </label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={actionLoading}
              className="w-full px-4 py-3 clay-input text-sm font-semibold"
            />
          </div>

          <button 
            type="submit" 
            disabled={actionLoading}
            className="w-full py-3.5 clay-btn-purple font-black text-sm uppercase tracking-wider mt-4 cursor-pointer"
          >
            {isLoginTab ? "🔓 Authenticate & Enter" : "📝 Register & Join"}
          </button>
        </form>

      </div>

      {/* Quick Demo Assist details */}
      <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-center text-xs text-indigo-700 font-semibold">
        ✨ QuickSell authenticates credentials securely. Create multiple accounts to test Q&A threads and manage separate store inventories!
      </div>

    </div>
  );
}

export default AuthPage;