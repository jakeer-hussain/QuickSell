import React from "react";

function InquiryCard({
  inquiry,
  actionLoading,
  answerText,
  setAnswerText,
  onAnswer,
  setSelectedProductId,
  setActivePage,
}) {
  const buyerName =
    inquiry.buyer?.name ||
    "Potential Buyer";

  const productTitle =
    inquiry.listing?.title ||
    "Deleted Product";

  const productPrice =
    inquiry.listing?.price ||
    "N/A";

  const isSold =
    inquiry.listing?.status === "SOLD" ||
    inquiry.listing?.status === "Sold";

  const displayImage =
    Array.isArray(inquiry.listing?.images) &&
    inquiry.listing.images.length > 0
      ? inquiry.listing.images[0]
      : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400";

  return (
    <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col justify-between space-y-4">
      <div className="space-y-3">

        {/* Product Preview Header */}
        <div
          className="flex items-center gap-3 pb-3 border-b border-slate-50 cursor-pointer hover:opacity-90"
          onClick={() => {
            if (
              inquiry.listing?._id ||
              inquiry.listing?.id
            ) {
              setSelectedProductId(
                inquiry.listing._id ||
                inquiry.listing.id
              );

              setActivePage("detail");
            }
          }}
        >
          <img
            src={displayImage}
            alt={productTitle}
            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
          />

          <div className="min-w-0 flex-1">
            <h4 className="font-extrabold text-slate-800 text-xs truncate hover:text-indigo-600 transition-colors">
              {productTitle}
            </h4>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-indigo-600">
                ${productPrice}
              </span>

              {isSold && (
                <span className="text-[9px] font-black uppercase bg-red-100 text-red-700 px-1 py-0.5 rounded">
                  Sold Out
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span className="px-1.5 py-0.5 bg-pink-100 text-pink-700 rounded">
              Query
            </span>

            <span>
              From {buyerName}
            </span>
          </div>

          <p className="text-xs font-bold text-slate-800 leading-relaxed pl-1">
            "{inquiry.message}"
          </p>
        </div>

        {/* Answer Section */}
        {inquiry.answer ? (
          <div className="pl-3 border-l-2 border-indigo-100 space-y-1">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded">
                Your Answer
              </span>
            </div>

            <p className="text-xs text-slate-600 italic pl-1">
              "{inquiry.answer}"
            </p>
          </div>
        ) : (
          <div className="pt-2 pl-3 border-l-2 border-pink-200 space-y-2">

            <div className="text-[10px] text-pink-500 font-bold uppercase tracking-wider">
              <span>Write Reply</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Write your answer..."
                value={answerText}
                onChange={(e) =>
                  setAnswerText(
                    e.target.value
                  )
                }
                disabled={actionLoading}
                className="flex-1 px-3 py-1.5 clay-input text-xs font-semibold"
              />

              <button
                onClick={() =>
                  onAnswer(
                    inquiry._id ||
                    inquiry.id
                  )
                }
                disabled={
                  actionLoading ||
                  !answerText.trim()
                }
                className="px-3.5 py-1.5 clay-btn-green text-[10px] font-bold cursor-pointer shrink-0"
              >
                Reply
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default InquiryCard;