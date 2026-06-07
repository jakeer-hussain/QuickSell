import React, { useState, useEffect, useContext } from "react";
import { MessageCircle, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import listingService from "../services/listingService";
import inquiryService from "../services/inquiryService";
import ProfileHeader from "../components/profile/ProfileHeader";
import CreateListingForm from "../components/profile/CreateListingForm";
import ListingRow from "../components/profile/ListingRow";
import InquiryCard from "../components/profile/InquiryCard";
import {uploadImageToCloudinary} from "../services/cloudinaryService";

function ProfilePage({ triggerToast = () => {} }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Inquiries State
  const [inquiries, setInquiries] = useState([]);
  const [answerTexts, setAnswerTexts] = useState({});
  const [inquiryTab, setInquiryTab] = useState("pending"); // 'pending' | 'answered' | 'all'

  // New Listing Form States
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("Electronics");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState("");

  useEffect(() => {
    fetchMyListings();
    fetchMyInquiries();
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

  const fetchMyInquiries = async () => {
    try {
      const data = await inquiryService.getSellerInquiries();
      setInquiries(data);
    } catch (err) {
      console.error("Failed to load seller inquiries:", err);
    }
  };

  const handleAnswerInquiry = async (inquiryId) => {
    const text = answerTexts[inquiryId];
    if (!text || !text.trim()) return;
    try {
      setActionLoading(true);
      await inquiryService.answerInquiry(inquiryId, text);
      setAnswerTexts((prev) => ({ ...prev, [inquiryId]: "" }));
      triggerToast("Answer submitted to potential buyer! ✉️");
      await fetchMyInquiries();
    } catch (err) {
      console.error("Failed to submit answer:", err);
      triggerToast(err.response?.data?.message || "Failed to submit answer. ⚠️");
    } finally {
      setActionLoading(false);
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
      let imageUrl = "";

      if (newImage) {
        imageUrl =
          await uploadImageToCloudinary(
            newImage
          );
      }

      const listingData = {
        title: newTitle,
        description:
          newDescription ||
          "No description provided.",
        price: Number(newPrice),
        category: newCategory,
        images: imageUrl
          ? [imageUrl]
          : [],
        status: "ACTIVE"
      };

      await listingService.createListing(listingData);
      
      // Clear form
      setNewTitle("");
      setNewPrice("");
      setNewDescription("");
      setNewImage(null);
      
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
        <button onClick={() => navigate("/auth")} className="px-5 py-2.5 clay-btn-purple text-xs font-black uppercase tracking-wider cursor-pointer">
          Login / Sign Up
        </button>
      </div>
    );
  }

  // Count sold items as completed sales
  const completedSales = myListings.filter(p => p.status === "SOLD" || p.status === "Sold").length;

  return (
    <div className="space-y-8">
      
      <ProfileHeader
        user={user}
        totalListings={myListings.length}
        completedSales={completedSales}
      />

      {/* Main Profile Grid split: List a New Product & My Active Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* List a New Product Form (Clay styled card) */}
        <CreateListingForm
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          newPrice={newPrice}
          setNewPrice={setNewPrice}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          newDescription={newDescription}
          setNewDescription={setNewDescription}
          newImage={newImage}
          setNewImage={setNewImage}
          actionLoading={actionLoading}
          onSubmit={handleAddProduct}
        />

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
            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
              {myListings.map((listing) => (
                <ListingRow
                  key={listing._id || listing.id}
                  listing={listing}
                  actionLoading={actionLoading}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeleteListing}
                />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Inquiries / Q&A Dashboard */}
      <div className="clay-card p-6 md:p-8 bg-white space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-indigo-500" /> Received Customer Inquiries
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              View and answer questions from potential buyers about your products.
            </p>
          </div>

          {/* Tab filters */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-500">
            {[
              { id: "pending", label: "Pending Reply" },
              { id: "answered", label: "Answered" },
              { id: "all", label: "All Queries" }
            ].map((tab) => {
              const count = inquiries.filter(q => {
                if (tab.id === "pending") return !q.answer;
                if (tab.id === "answered") return !!q.answer;
                return true;
              }).length;
              return (
                <button
                  key={tab.id}
                  onClick={() => setInquiryTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    inquiryTab === tab.id
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "hover:text-slate-800"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                    inquiryTab === tab.id ? "bg-indigo-100 text-indigo-700" : "bg-slate-200 text-slate-600"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtered inquiries list */}
        {(() => {
          const filteredInquiries = inquiries.filter((q) => {
            if (inquiryTab === "pending") return !q.answer;
            if (inquiryTab === "answered") return !!q.answer;
            return true;
          });

          if (filteredInquiries.length === 0) {
            return (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto animate-pulse" />
                <p className="text-sm font-bold">No inquiries found in this section!</p>
                <p className="text-xs">
                  {inquiryTab === "pending" 
                    ? "Hooray! No pending questions to answer right now."
                    : "No answered inquiries yet."}
                </p>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredInquiries.map((inquiry) => (
                <InquiryCard
                  key={inquiry._id || inquiry.id}
                  inquiry={inquiry}
                  actionLoading={actionLoading}
                  answerText={
                    answerTexts[inquiry._id || inquiry.id] || ""
                  }
                  setAnswerText={(value) =>
                    setAnswerTexts((prev) => ({
                      ...prev,
                      [inquiry._id || inquiry.id]: value,
                    }))
                  }
                  onAnswer={handleAnswerInquiry}
                />
              ))}
            </div>
          );
        })()}
      </div>

    </div>
  );
}

export default ProfilePage;
