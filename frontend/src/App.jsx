import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import ListingDetailsPage from "./pages/ListingDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { AuthProvider } from "./context/AuthContext";

function MainAppContent() {
  const [activePage, setActivePage] = useState("explore"); // 'explore' | 'detail' | 'profile' | 'auth'
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastTimeoutId, setToastTimeoutId] = useState(null);

  const triggerToast = (msg) => {
    if (toastTimeoutId) {
      clearTimeout(toastTimeoutId);
    }
    setToastMessage(msg);
    const id = setTimeout(() => {
      setToastMessage("");
    }, 4000);
    setToastTimeoutId(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50/40 via-slate-50 to-pink-50/30 flex flex-col justify-between antialiased">
      <div>
        <Header activePage={activePage} setActivePage={setActivePage} />

        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
          {activePage === "explore" && (
            <HomePage
              setSelectedProductId={setSelectedProductId}
              setActivePage={setActivePage}
            />
          )}

          {activePage === "detail" && (
            <ListingDetailsPage
              selectedProductId={selectedProductId}
              setActivePage={setActivePage}
              triggerToast={triggerToast}
            />
          )}

          {activePage === "profile" && (
            <ProfilePage
              setSelectedProductId={setSelectedProductId}
              setActivePage={setActivePage}
              triggerToast={triggerToast}
            />
          )}

          {activePage === "auth" && (
            <AuthPage
              setActivePage={setActivePage}
              triggerToast={triggerToast}
            />
          )}
        </main>
      </div>

      <Footer />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-slate-900/95 backdrop-blur-sm text-white px-6 py-3.5 rounded-2xl border-2 border-white/20 shadow-2xl flex items-center gap-3">
            <span className="text-xs font-black tracking-wider uppercase text-pink-400">ReSeller:</span>
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

export default App;