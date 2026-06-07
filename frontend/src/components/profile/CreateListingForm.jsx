import React from "react";
import { Plus } from "lucide-react";

const CATEGORIES = [
  "Electronics",
  "Furniture",
  "Books",
  "Vehicles",
  "Clothing",
  "Sports",
  "Home Appliances",
  "Other",
];

function CreateListingForm({
  newTitle,
  setNewTitle,

  newPrice,
  setNewPrice,

  newCategory,
  setNewCategory,

  newDescription,
  setNewDescription,

  newImage,
  setNewImage,

  actionLoading,

  onSubmit,
}) {
  return (
    <div className="lg:col-span-5 clay-card p-6 md:p-8 bg-white space-y-6">
      <div>
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Plus className="w-5 h-5 text-indigo-500" />
          Create New Listing
        </h3>

        <p className="text-xs text-slate-500 font-medium">
          Post a new item for sale instantly to the marketplace.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4"
      >
        {/* Product Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase text-slate-500 tracking-wider">
            Product Name
          </label>

          <input
            type="text"
            placeholder="e.g., Pastel Mechanical Keyboard"
            value={newTitle}
            onChange={(e) =>
              setNewTitle(e.target.value)
            }
            disabled={actionLoading}
            className="w-full px-4 py-3 clay-input text-sm font-semibold"
          />
        </div>

        {/* Category + Price */}
        <div className="grid grid-cols-2 gap-4">

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-slate-500 tracking-wider">
              Category
            </label>

            <select
              value={newCategory}
              onChange={(e) =>
                setNewCategory(e.target.value)
              }
              disabled={actionLoading}
              className="w-full px-4 py-3 clay-input text-sm font-semibold appearance-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                >
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-slate-500 tracking-wider">
              Price ($ USD)
            </label>

            <input
              type="number"
              placeholder="Price"
              value={newPrice}
              onChange={(e) =>
                setNewPrice(e.target.value)
              }
              disabled={actionLoading}
              className="w-full px-4 py-3 clay-input text-sm font-semibold"
            />
          </div>

        </div>

        {/* Mock Image Picker */}
        <div className="space-y-2">
          {/* <label className="text-xs font-black uppercase text-slate-500 tracking-wider">
            Product Image
          </label> */}

          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-500 tracking-wider">
              Product Image
            </label>

            <label className="flex items-center justify-between px-4 py-3 clay-input cursor-pointer">
              <span className="text-sm font-semibold text-slate-600">
                {newImage ? newImage.name : "Choose an image"}
              </span>

              <span className="px-3 py-1 rounded-lg bg-indigo-500 text-white text-xs font-bold">
                Browse
              </span>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setNewImage(file);
                  }
                }}
              />
            </label>

            {newImage && (
              <img
                src={URL.createObjectURL(newImage)}
                alt="Preview"
                className="w-full h-40 object-cover rounded-xl"
              />
            )}
          </div>

          {newImage && (
            <img
              src={URL.createObjectURL(newImage)}
              alt="Preview"
              className="w-full h-40 object-cover rounded-xl"
            />
          )}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase text-slate-500 tracking-wider">
            Item Details & Specs
          </label>

          <textarea
            placeholder="Describe details, sizes, quality parameters..."
            rows={3}
            value={newDescription}
            onChange={(e) =>
              setNewDescription(e.target.value)
            }
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
  );
}

export default CreateListingForm;