import React from "react";
import { Search, Layers, Briefcase, DollarSign } from "lucide-react";

// Categories matching backend constants
const CATEGORIES = [
  "Electronics",
  "Furniture",
  "Books",
  "Vehicles",
  "Clothing",
  "Sports",
  "Home Appliances",
  "Other"
];

function ProductFilters({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  maxPrice,
  setMaxPrice,
}) {
  return (
    <div className="clay-card p-6 bg-white/90">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
        
        {/* Search Bar */}
        <div className="lg:col-span-4 space-y-2">
          <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5" /> What are you looking for?
          </label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search tech, books, clothing..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 clay-input text-sm font-semibold"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
          </div>
        </div>

        {/* Category Select */}
        <div className="lg:col-span-3 space-y-2">
          <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Category Filter
          </label>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-3 clay-input text-sm font-semibold appearance-none cursor-pointer"
          >
            <option value="All">🌈 All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="lg:col-span-2 space-y-2">
          <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" /> Status
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {['All', 'Available', 'Sold'].map((status) => (
              <button
                type="button"
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`py-1.5 text-[11px] font-extrabold rounded-lg transition-all cursor-pointer ${
                  statusFilter === status 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Price Filter Slider */}
        <div className="lg:col-span-3 space-y-2">
          <div className="flex justify-between items-center text-xs font-black uppercase text-slate-500 tracking-wider">
            <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> Max Price</span>
            <span className="text-indigo-600 font-black">${maxPrice}</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="1000" 
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] font-bold text-slate-400">
            <span>$1</span>
            <span>$1000</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductFilters;