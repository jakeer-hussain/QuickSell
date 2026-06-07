import React from "react";
import { Check, Tag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ListingRow({
  listing,
  actionLoading,
  onToggleStatus,
  onDelete,
}) {
  const navigate = useNavigate();
  const isSold =
    listing.status === "SOLD" ||
    listing.status === "Sold";

  const displayImage =
    Array.isArray(listing.images) &&
    listing.images.length > 0
      ? listing.images[0]
      : (
          listing.image ||
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400"
        );

  return (
    <div className="clay-card p-4 bg-white hover:translate-y-0 hover:shadow-md flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => {
          navigate(`/listings/${listing._id || listing.id}`);
        }}
      >
        <img
          src={displayImage}
          alt={listing.title}
          className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
        />

        <div className="space-y-1">
          <h4 className="font-bold text-slate-800 text-sm line-clamp-1 hover:text-indigo-600 transition-colors">
            {listing.title}
          </h4>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-indigo-600">
              ${listing.price}
            </span>

            <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
              {listing.category}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0">
        <div className="text-right">
          <span className="text-[9px] uppercase font-black text-slate-400 block mb-0.5">
            Quick Toggle Status
          </span>

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
          onClick={() =>
            onToggleStatus(
              listing._id || listing.id,
              listing.status
            )
          }
          disabled={actionLoading}
          className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
            isSold
              ? "bg-indigo-100 border-indigo-200 text-indigo-700 hover:bg-indigo-200"
              : "bg-red-100 border-red-200 text-red-700 hover:bg-red-200"
          }`}
        >
          {isSold ? (
            <Check className="w-4 h-4" />
          ) : (
            <Tag className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={() =>
            onDelete(
              listing._id || listing.id
            )
          }
          disabled={actionLoading}
          className="p-2.5 rounded-xl border-2 bg-red-50 border-red-150 text-red-600 hover:bg-red-100 transition-all cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default ListingRow;