import React, { useContext } from "react";
import { ShoppingBag, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Header() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isExplore = location.pathname === "/";
  const isProfile = location.pathname === "/profile";
  const isAuth = location.pathname === "/auth";

  return (
    <header className="sticky top-0 z-40 px-4 py-3 md:px-8 bg-white/60 backdrop-blur-md border-b-2 border-white/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
        
        {/* Logo Brand */}
        <div 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-12 h-12 bg-gradient-to-tr from-pink-400 to-indigo-400 rounded-2xl flex items-center justify-center border-2 border-white shadow-md transform group-hover:rotate-6 transition-transform">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              QuickSell
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">Clay Edition</p>
          </div>
        </div>

        {/* User Info Section */}
        {user ? (
          <div className="flex items-center gap-2 bg-indigo-50/70 p-1.5 rounded-2xl border border-indigo-100">
            <span className="text-xs font-bold text-indigo-600 px-2">User:</span>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-white shadow-sm text-xs font-bold text-slate-700">
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-pink-400 to-indigo-400 flex items-center justify-center text-[10px] text-white font-extrabold uppercase">
                {user.name.substring(0, 2)}
              </div>
              <span>{user.name}</span>
            </div>
          </div>
        ) : (
          <div className="text-xs font-bold text-slate-400 italic px-2">
            Sign in to sell or ask queries
          </div>
        )}

        {/* Primary Navigation links */}
        <nav className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/")}
            className={`px-4 py-2 text-sm font-bold transition-all clay-nav-btn cursor-pointer ${
              isExplore 
                ? "bg-indigo-100 text-indigo-600 border-indigo-200" 
                : "bg-white/80 text-slate-600"
            }`}
          >
            🛍️ Shop Explore
          </button>
          
          {user && (
            <button 
              onClick={() => navigate("/profile")}
              className={`px-4 py-2 text-sm font-bold transition-all clay-nav-btn cursor-pointer ${
                isProfile 
                  ? "bg-pink-100 text-pink-600 border-pink-200" 
                  : "bg-white/80 text-slate-600"
              }`}
            >
              👤 Dashboard
            </button>
          )}

          {user ? (
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-bold transition-all clay-nav-btn bg-white/80 text-red-500 border-red-100 hover:bg-red-50 cursor-pointer"
            >
              🚪 Logout
            </button>
          ) : (
            <button 
              onClick={() => navigate("/auth")}
              className={`px-4 py-2 text-sm font-bold transition-all clay-nav-btn cursor-pointer ${
                isAuth 
                  ? "bg-purple-100 text-purple-600 border-purple-200" 
                  : "bg-white/80 text-slate-600"
              }`}
            >
              🔑 Join / Login
            </button>
          )}
        </nav>

      </div>
    </header>
  );
}

export default Header;