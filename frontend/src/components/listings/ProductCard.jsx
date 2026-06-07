import React from "react";
import { ChevronRight, MessageCircle } from "lucide-react";

function ProductCard({ product, setSelectedProductId, setActivePage }) {
  const isSold = product.status === "SOLD" || product.status === "Sold";
  const displayCategory = product.category || "General";
  const displayTitle = product.title || "No Title";
  const displayDescription = product.description || "No description provided.";
  const displayPrice = product.price ?? 0;
  const sellerName = product.seller?.name || product.ownerName || "Seller";
  
  // Use first image if it is an array, otherwise use image field or fallback
  const displayImage = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : (product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400");

  const handleCardClick = () => {
    setSelectedProductId(product._id || product.id);
    setActivePage("detail");
  };

  return (
    <div 
      className="clay-card bg-white flex flex-col justify-between overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image Container with tag */}
      <div className="p-4 relative">
        <div className="w-full h-48 rounded-2xl overflow-hidden relative border-2 border-white/80 shadow-inner bg-slate-50">
          <img 
            src={displayImage} 
            alt={displayTitle} 
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        {/* Sold Badge */}
        <div className="absolute top-6 right-6">
          {isSold ? (
            <span className="px-3 py-1.5 text-xs font-black tracking-wider uppercase clay-badge-sold shadow-sm">
              🔒 SOLD
            </span>
          ) : (
            <span className="px-3 py-1.5 text-xs font-black tracking-wider uppercase clay-badge-available shadow-sm">
              🟢 AVAILABLE
            </span>
          )}
        </div>

        {/* Category Indicator */}
        <div className="absolute top-6 left-6">
          <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-white/95 text-slate-600 rounded-lg shadow-sm border border-slate-100">
            {displayCategory}
          </span>
        </div>
      </div>

      {/* Details Area */}
      <div className="px-5 pb-5 pt-1 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <h4 className="font-black text-lg text-slate-800 line-clamp-1 hover:text-indigo-600 transition-colors">
            {displayTitle}
          </h4>
          <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
            {displayDescription}
          </p>
        </div>

        {/* Price and Action row */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Price tag</span>
            <div className="text-2xl font-black text-indigo-600">${displayPrice}</div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-indigo-500 bg-indigo-50/50 px-3 py-2 rounded-xl border border-indigo-100/50 hover:bg-indigo-100/50 transition-all">
            <span>Details</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Owner Badge */}
        <div className="flex items-center justify-between bg-slate-50/80 p-2 rounded-xl text-[11px] font-bold text-slate-500">
          <span className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-pink-400 to-indigo-400 flex items-center justify-center text-[8px] text-white font-extrabold uppercase shrink-0">
              {sellerName.substring(0, 2)}
            </div>
            <span>Listed by <b>{sellerName}</b></span>
          </span>
        </div>

      </div>
    </div>
  );
}

export default ProductCard;