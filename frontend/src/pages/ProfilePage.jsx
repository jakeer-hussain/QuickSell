import React, { useState, useEffect, useContext } from "react";
import { Plus, Check, Tag, Trash2 } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import listingService from "../services/listingService";

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

function ProfilePage({ setSelectedProductId, setActivePage, triggerToast = () => {} }) {
  const { user } = useContext(AuthContext);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // New Listing Form States
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("Electronics");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState("https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400");

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const data = await listingService.getMyListings();
      setMyListings(data);
      setError("");
    } catch (err) {
      console.error("Failed to load user listings:", err);
      setError("Failed to load your listings.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice) {
      triggerToast("Please complete Title and Price! ⚠️");
      return;
    }

    try {
      setActionLoading(true);
      const listingData = {
        title: newTitle,
        description: newDescription || "No description provided.",
        price: Number(newPrice),
        category: newCategory,
        images: [newImage],
        status: "ACTIVE"
      };

      await listingService.createListing(listingData);
      
      // Clear form
      setNewTitle("");
      setNewPrice("");
      setNewDescription("");
      
      triggerToast("New listing posted successfully! 🚀");
      
      // Reload listings
      await fetchMyListings();
    } catch (err) {
      console.error("Failed to post listing:", err);
      triggerToast(err.response?.data?.message || "Failed to create listing. ⚠️");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    const isCurrentlySold = currentStatus === "SOLD" || currentStatus === "Sold";
    try {
      setActionLoading(true);
      if (isCurrentlySold) {
        // Toggle back to active
        await listingService.updateListing(productId, { status: "ACTIVE" });
        triggerToast("Marked listing as Active! 🟢");
      } else {
        // Mark as sold
        await listingService.markAsSold(productId);
        triggerToast("Marked listing as Sold! 🔒");
      }
      await fetchMyListings();
    } catch (err) {
      console.error("Failed to toggle listing status:", err);
      triggerToast("Failed to update status. ⚠️");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteListing = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      setActionLoading(true);
      await listingService.deleteListing(productId);
      triggerToast("Listing deleted successfully. 🗑️");
      await fetchMyListings();
    } catch (err) {
      console.error("Failed to delete listing:", err);
      triggerToast("Failed to delete listing. ⚠️");
    } finally {
      setActionLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="clay-card p-12 text-center bg-white/70 max-w-md mx-auto space-y-4">
        <h4 className="text-lg font-bold text-slate-700">Access Denied</h4>
        <p className="text-xs text-slate-500">Please register or log in to access your dashboard.</p>
        <button onClick={() => setActivePage("auth")} className="px-5 py-2.5 clay-btn-purple text-xs font-black uppercase tracking-wider cursor-pointer">
          Login / Sign Up
        </button>
      </div>
    );
  }

  // Count sold items as completed sales
  const completedSales = myListings.filter(p => p.status === "SOLD" || p.status === "Sold").length;

  return (
    <div className="space-y-8">
      
      {/* User Bio Header (wallet balance and ratings omitted as requested) */}
      <div className="clay-card p-6 md:p-8 bg-gradient-to-tr from-pink-50 via-white to-indigo-50 border border-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-400 to-indigo-400 flex items-center justify-center text-3xl text-white font-extrabold uppercase shadow-lg">
                {user.name.substring(0, 2)}
              </div>
              <span className="absolute bottom-1 right-1 w-6 h-6 bg-green-400 border-2 border-white rounded-full flex items-center justify-center shadow-md">
                <Check className="w-3.5 h-3.5 text-white" />
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-800">{user.name}</h3>
              <p className="text-xs text-indigo-600 font-bold tracking-wider">{user.email}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-1.5 text-xs text-slate-500 font-bold">
                <span className="px-2.5 py-1 bg-white/90 rounded-lg border border-slate-100 shadow-sm">📦 {myListings.length} Total Listings</span>
                <span className="px-2.5 py-1 bg-white/90 rounded-lg border border-slate-100 shadow-sm">🎉 {completedSales} Completed Sales</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Profile Grid split: List a New Product & My Active Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* List a New Product Form (Clay styled card) */}
        <div className="lg:col-span-5 clay-card p-6 md:p-8 bg-white space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-500" /> Create New Listing
            </h3>
            <p className="text-xs text-slate-500 font-medium">Post a new item for sale instantly to the marketplace.</p>
          </div>

          <form onSubmit={handleAddProduct} className="space-y-4">
            
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Product Name</label>
              <input 
                type="text" 
                placeholder="e.g., Pastel Mechanical Keyboard" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                disabled={actionLoading}
                className="w-full px-4 py-3 clay-input text-sm font-semibold"
              />
            </div>

            {/* Category and Price Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Category</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  disabled={actionLoading}
                  className="w-full px-4 py-3 clay-input text-sm font-semibold appearance-none cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Price ($ USD)</label>
                <input 
                  type="number" 
                  placeholder="Price" 
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  disabled={actionLoading}
                  className="w-full px-4 py-3 clay-input text-sm font-semibold"
                />
              </div>
            </div>

            {/* Photo Preset Mock Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider block">Choose Mock Photo Preset</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: "Tech", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400" },
                  { name: "Soles", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400" },
                  { name: "Watch", url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=400" },
                  { name: "Decor", url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400" }
                ].map((preset, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => !actionLoading && setNewImage(preset.url)}
                    className={`h-12 rounded-xl overflow-hidden cursor-pointer border-2 transition-all relative ${newImage === preset.url ? "border-pink-500 scale-95 shadow-md" : "border-slate-200 opacity-70 hover:opacity-100"}`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Item Details & Specs</label>
              <textarea 
                placeholder="Describe details, sizes, quality parameters..." 
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                disabled={actionLoading}
                className="w-full px-4 py-3 clay-input text-sm font-semibold"
              />
            </div>

            <button 
              type="submit" 
              disabled={actionLoading}
              className="w-full py-3.5 clay-btn-purple font-black text-sm uppercase tracking-wider cursor-pointer"
            >
              🎉 Post Item Listing
            </button>

          </form>
        </div>

        {/* My Products List & Manage Dashboard */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-800">
                📦 My Active Listings
              </h3>
              <p className="text-xs text-slate-500 font-medium">Manage, mark as Sold or Available, and delete listings.</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="clay-card p-6 text-center text-red-500 font-bold">
              {error}
            </div>
          ) : myListings.length === 0 ? (
            <div className="clay-card p-10 bg-white/70 text-center space-y-3">
              <p className="text-sm font-bold text-slate-600">No active products listed under your user profile.</p>
              <p className="text-xs text-slate-500">Create a brand new listing on the left panel to test active controls!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myListings.map((p) => {
                const isSold = p.status === "SOLD" || p.status === "Sold";
                const displayImage = Array.isArray(p.images) && p.images.length > 0 
                  ? p.images[0] 
                  : (p.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400");
                
                return (
                  <div 
                    key={p._id || p.id} 
                    className="clay-card p-4 bg-white hover:translate-y-0 hover:shadow-md flex flex-col sm:flex-row sm:items-center gap-4 justify-between"
                  >
                    <div 
                      className="flex items-center gap-4 cursor-pointer"
                      onClick={() => {
                        setSelectedProductId(p._id || p.id);
                        setActivePage("detail");
                      }}
                    >
                      <img 
                        src={displayImage} 
                        alt={p.title} 
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-800 text-sm line-clamp-1 hover:text-indigo-600 transition-colors">
                          {p.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-indigo-600">${p.price}</span>
                          <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {p.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Toggle for Status & Delete */}
                    <div className="flex items-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0">
                      
                      <div className="text-right">
                        <span className="text-[9px] uppercase font-black text-slate-400 block mb-0.5">Quick Toggle Status</span>
                        {isSold ? (
                          <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider clay-badge-sold">
                            SOLD OUT
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider clay-badge-available">
                            SELLING ACTIVE
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleToggleStatus(p._id || p.id, p.status)}
                        disabled={actionLoading}
                        className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                          isSold 
                            ? "bg-indigo-100 border-indigo-200 text-indigo-700 hover:bg-indigo-200" 
                            : "bg-red-100 border-red-200 text-red-700 hover:bg-red-200"
                        }`}
                        title={isSold ? "Mark as Available" : "Mark as Sold"}
                      >
                        {isSold ? (
                          <Check className="w-4 h-4 font-bold" />
                        ) : (
                          <Tag className="w-4 h-4 font-bold" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteListing(p._id || p.id)}
                        disabled={actionLoading}
                        className="p-2.5 rounded-xl border-2 bg-red-50 border-red-150 text-red-600 hover:bg-red-100 transition-all cursor-pointer"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default ProfilePage;
