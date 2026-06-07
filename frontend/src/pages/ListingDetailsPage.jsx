import React, { useState, useEffect, useContext } from "react";
import { ArrowLeft, MessageCircle, Info, Sparkles } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import listingService from "../services/listingService";
import inquiryService from "../services/inquiryService";

function ListingDetailsPage({ selectedProductId, setActivePage, triggerToast = () => {} }) {
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [answerTexts, setAnswerTexts] = useState({}); // inquiryId -> answer string
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (selectedProductId) {
      fetchDetails();
    }
  }, [selectedProductId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const prodData = await listingService.getListingById(selectedProductId);
      setProduct(prodData);
      
      const inquiriesData = await inquiryService.getInquiriesByListing(selectedProductId);
      setInquiries(inquiriesData);
      setError("");
    } catch (err) {
      console.error("Failed to load listing details:", err);
      setError("Failed to load listing details.");
    } finally {
      setLoading(false);
    }
  };

  const reloadInquiries = async () => {
    try {
      const inquiriesData = await inquiryService.getInquiriesByListing(selectedProductId);
      setInquiries(inquiriesData);
    } catch (err) {
      console.error("Failed to reload inquiries:", err);
    }
  };

  const handleAskQuestion = async () => {
    if (!questionText.trim()) return;
    try {
      setActionLoading(true);
      await inquiryService.createInquiry(product._id || product.id, questionText);
      setQuestionText("");
      triggerToast("Your question was posted to the seller! 💬");
      await reloadInquiries();
    } catch (err) {
      console.error("Failed to ask question:", err);
      triggerToast(err.response?.data?.message || "Failed to submit question. ⚠️");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAnswerQuestion = async (inquiryId) => {
    const text = answerTexts[inquiryId];
    if (!text || !text.trim()) return;
    try {
      setActionLoading(true);
      await inquiryService.answerInquiry(inquiryId, text);
      setAnswerTexts((prev) => ({ ...prev, [inquiryId]: "" }));
      triggerToast("Answer submitted to potential buyer! ✉️");
      await reloadInquiries();
    } catch (err) {
      console.error("Failed to submit answer:", err);
      triggerToast(err.response?.data?.message || "Failed to submit answer. ⚠️");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleSold = async () => {
    if (!product) return;
    const isCurrentlySold = product.status === "SOLD" || product.status === "Sold";
    try {
      setActionLoading(true);
      let updated;
      if (isCurrentlySold) {
        // Toggle back to active
        updated = await listingService.updateListing(product._id || product.id, { status: "ACTIVE" });
        triggerToast(`Marked "${product.title}" as Available! 🎉`);
      } else {
        // Mark as sold
        updated = await listingService.markAsSold(product._id || product.id);
        triggerToast(`Marked "${product.title}" as Sold! 🎉`);
      }
      setProduct(updated);
    } catch (err) {
      console.error("Failed to toggle listing status:", err);
      triggerToast(err.response?.data?.message || "Failed to update status. ⚠️");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBuySimulated = () => {
    triggerToast("Purchase flow simulated! Talk with the seller in the Q&A segment. 🛍️");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setActivePage("explore")}
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-600 font-bold rounded-xl border-2 border-white shadow-sm hover:text-slate-800 transition-all text-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to listings explore
        </button>
        <div className="clay-card p-8 text-center text-red-500 font-bold max-w-md mx-auto">
          {error || "Product not found."}
        </div>
      </div>
    );
  }

  const productId = product._id || product.id;
  const sellerId = product.seller?._id || product.seller?.id || product.seller;
  const isOwner = user && user.id === sellerId;
  const isSold = product.status === "SOLD" || product.status === "Sold";
  const sellerName = product.seller?.name || "Seller";

  return (
    <div className="space-y-8">
      {/* Back button */}
      <button 
        onClick={() => setActivePage("explore")}
        className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-600 font-bold rounded-xl border-2 border-white shadow-sm hover:text-slate-800 transition-all text-xs cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to listings explore
      </button>

      {/* Two-Column Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Product Image Gallery */}
        <div className="lg:col-span-6 clay-card p-6 bg-white space-y-4">
          <div className="w-full h-80 sm:h-[400px] rounded-2xl overflow-hidden border-2 border-white shadow-inner bg-slate-100 relative">
            <img 
              src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : (product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600")} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
            
            {/* Status Indicator Pill Overlay */}
            <div className="absolute top-4 right-4">
              {isSold ? (
                <span className="px-4 py-2 text-sm font-black tracking-wider uppercase clay-badge-sold shadow-md">
                  🔒 Sold Out
                </span>
              ) : (
                <span className="px-4 py-2 text-sm font-black tracking-wider uppercase clay-badge-available shadow-md">
                  🟢 Available
                </span>
              )}
            </div>
          </div>

          {/* Fun Clay Image Tips */}
          <div className="flex items-center gap-3 bg-pink-50/50 p-4 rounded-xl border border-pink-100 text-xs text-pink-700 font-semibold">
            <Info className="w-5 h-5 text-pink-500 shrink-0" />
            <p>Clay Tip: Always communicate with the seller on this page’s Q&A thread below to discuss delivery & quality checks!</p>
          </div>
        </div>

        {/* Right Column: Detailed Specs & Seller Info */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Clay Details card */}
          <div className="clay-card p-6 md:p-8 bg-white space-y-6">
            
            <div className="space-y-2">
              <span className="px-2.5 py-1 text-xs font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 rounded-lg">
                {product.category}
              </span>
              <h2 className="text-3xl font-black text-slate-800">
                {product.title}
              </h2>
            </div>

            <div className="flex items-end justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="space-y-1">
                <span className="text-xs uppercase font-black text-slate-400">Fixed Sale Price</span>
                <div className="text-4xl font-black text-indigo-600">${product.price}</div>
              </div>
              
              {/* Mark as Sold for Seller Quick Actions */}
              {isOwner ? (
                <button 
                  onClick={handleToggleSold}
                  disabled={actionLoading}
                  className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all shadow-md rounded-xl cursor-pointer ${
                    isSold 
                      ? "clay-btn-purple" 
                      : "bg-red-500 hover:bg-red-600 text-white border-2 border-white"
                  }`}
                >
                  {isSold ? "🔓 Set Available" : "🔒 Mark as Sold"}
                </button>
              ) : (
                <button 
                  onClick={handleBuySimulated}
                  disabled={isSold}
                  className={`px-6 py-3 font-bold text-sm cursor-pointer ${
                    isSold 
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed border-none shadow-none" 
                      : "clay-btn-pink"
                  }`}
                >
                  {isSold ? "Sold Out" : "Buy Product Now"}
                </button>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Item Description</h4>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Owner Metadata Row (Ratings component disabled as requested) */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-400 to-indigo-400 flex items-center justify-center text-sm text-white font-extrabold uppercase shadow-inner">
                  {sellerName.substring(0, 2)}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black text-slate-400 block">Owner / Seller</span>
                  <h5 className="font-bold text-slate-800 text-sm">{sellerName}</h5>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-black text-slate-400 block">Contact Info</span>
                <span className="text-xs font-bold text-indigo-600">{product.seller?.email || "N/A"}</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Q&A Interactive Segment (Important Feature) */}
      <div className="clay-card p-6 md:p-8 bg-white space-y-6">
        
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-indigo-500" /> Discussion & Queries
            </h3>
            <p className="text-xs text-slate-500 font-medium">Ask questions or clear up product specifications with the seller directly.</p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
            {inquiries.length} Queries
          </span>
        </div>

        {/* Ask Question Input Form */}
        {!user ? (
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 text-center text-xs text-slate-500 font-bold">
            🔒 Please <button onClick={() => setActivePage("auth")} className="text-indigo-600 hover:underline font-black cursor-pointer">login or sign up</button> to ask questions or discuss this product with the seller.
          </div>
        ) : !isOwner ? (
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-3">
            <h4 className="text-xs font-black text-slate-600 uppercase tracking-wider">
              Have a question for {sellerName}?
            </h4>
            <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="e.g., Is delivery fee included? Are there any minor scratches?" 
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                disabled={actionLoading}
                className="flex-1 px-4 py-3 clay-input text-sm font-medium"
              />
              <button 
                onClick={handleAskQuestion}
                disabled={actionLoading || !questionText.trim()}
                className="px-5 py-3 clay-btn-purple text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                Ask Seller
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 text-xs text-indigo-700 font-semibold">
            👑 You are viewing your own listed product! Potential buyer queries will show up below. You can answer them instantly.
          </div>
        )}

        {/* Q&A Thread List */}
        <div className="space-y-4">
          {inquiries.length === 0 ? (
            <div className="text-center py-8 text-slate-400 space-y-2">
              <p className="text-sm font-bold">No queries asked yet!</p>
              <p className="text-xs">Be the first to ask the seller a question regarding this item.</p>
            </div>
          ) : (
            inquiries.map((q) => {
              const buyerName = q.buyer?.name || "Anonymous Buyer";
              const hasAnswer = !!q.answer;
              
              return (
                <div key={q._id || q.id} className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-3.5">
                  
                  {/* Question section */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-pink-100 text-pink-700 rounded uppercase">
                        Question
                      </span>
                      <span className="text-xs font-black text-slate-700">{buyerName}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 pl-1">{q.message}</p>
                  </div>

                  {/* Answer section */}
                  <div className="pl-4 border-l-2 border-indigo-100 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded uppercase">
                        Seller Answer
                      </span>
                      <span className="text-xs font-bold text-slate-600">{sellerName}</span>
                    </div>
                    
                    {hasAnswer ? (
                      <p className="text-sm font-medium text-slate-600 italic">
                        "{q.answer}"
                      </p>
                    ) : (
                      // Answer Form (only viewable and inputtable by actual seller of product)
                      isOwner ? (
                        <div className="flex gap-2 mt-2 pt-1 max-w-lg">
                          <input 
                            type="text" 
                            placeholder="Write your reply here..." 
                            value={answerTexts[q._id || q.id] || ""}
                            onChange={(e) => setAnswerTexts({ ...answerTexts, [q._id || q.id]: e.target.value })}
                            disabled={actionLoading}
                            className="flex-1 px-3 py-1.5 clay-input text-xs font-semibold"
                          />
                          <button 
                            onClick={() => handleAnswerQuestion(q._id || q.id)}
                            disabled={actionLoading || !(answerTexts[q._id || q.id] || "").trim()}
                            className="px-3.5 py-1.5 clay-btn-green text-xs font-bold cursor-pointer"
                          >
                            Submit Answer
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">
                          ⏳ Pending seller response...
                        </p>
                      )
                    )}
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}

export default ListingDetailsPage;