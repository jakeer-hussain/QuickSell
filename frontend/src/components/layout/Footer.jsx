import React from "react";

function Footer() {
  return (
    <footer className="mt-20 border-t-2 border-white/50 bg-white/40 py-10 text-center text-xs text-slate-500 font-semibold space-y-2">
      <p>© 2026 ReSeller Claymorphic UI Labs. Crafted with 💖 for fluid interaction.</p>
      <p className="text-[10px] text-slate-400">
        All active items and questions are synced with the backend database. Test adding questions, toggling sold states, and listing products!
      </p>
    </footer>
  );
}

export default Footer;