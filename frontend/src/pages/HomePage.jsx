import React, { useState, useEffect, useMemo } from "react";
import { Filter } from "lucide-react";
import HeroSection from "../components/home/HeroSection";
import ProductFilters from "../components/listings/ProductFilters";
import ProductGrid from "../components/listings/ProductGrid";
import listingService from "../services/listingService";

function HomePage({ setSelectedProductId, setActivePage }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All"); // 'All' | 'Available' | 'Sold'
  const [maxPrice, setMaxPrice] = useState(1000);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      // Fetch listings (note: backend getAllListings returns ACTIVE ones)
      const data = await listingService.getAllListings();
      setProducts(data);
      setError("");
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError("Failed to fetch listings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch =
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCategory =
        categoryFilter === "All" || product.category === categoryFilter;
      
      const matchStatus =
        statusFilter === "All" ||
        (statusFilter === "Available" && (product.status === "ACTIVE" || product.status === "Active")) ||
        (statusFilter === "Sold" && (product.status === "SOLD" || product.status === "Sold"));
      
      const matchPrice = (product.price ?? 0) <= maxPrice;

      return matchSearch && matchCategory && matchStatus && matchPrice;
    });
  }, [products, searchQuery, categoryFilter, statusFilter, maxPrice]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("All");
    setStatusFilter("All");
    setMaxPrice(1000);
  };

  return (
    <div className="space-y-8">
      {/* Hero / Jumbotron */}
      <HeroSection />

      {/* Filter and Search Section */}
      <ProductFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
      />

      {/* Product Grid Results */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <span>✨ Featured Finds</span>
            {!loading && (
              <span className="text-xs bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full font-bold">
                {filteredProducts.length} items
              </span>
            )}
          </h3>

          {(searchQuery || categoryFilter !== "All" || statusFilter !== "All" || maxPrice < 1000) && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="clay-card p-6 text-center text-red-500 font-bold max-w-md mx-auto">
            {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="clay-card p-12 text-center bg-white/70 max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-slate-300">
              <Filter className="w-6 h-6 text-slate-400" />
            </div>
            <h4 className="text-lg font-bold text-slate-700">No products match your filters!</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Try broadening your search query or choosing another category to view more products.
            </p>
          </div>
        ) : (
          <ProductGrid
            products={filteredProducts}
            setSelectedProductId={setSelectedProductId}
            setActivePage={setActivePage}
          />
        )}
      </div>
    </div>
  );
}

export default HomePage;