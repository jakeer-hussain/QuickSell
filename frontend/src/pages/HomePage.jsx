import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter } from "lucide-react";
import HeroSection from "../components/home/HeroSection";
import ProductFilters from "../components/listings/ProductFilters";
import ProductGrid from "../components/listings/ProductGrid";
import listingService from "../services/listingService";

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [serverTotalPages, setServerTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All"); // 'All' | 'Available' | 'Sold'
  const [maxPrice, setMaxPrice] = useState(1000);

  // Debounced search query to prevent spamming backend requests
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const validatedPage = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;
  const ITEMS_PER_PAGE = 6;

  const fetchListings = async () => {
    try {
      setLoading(true);
      
      const apiFilters = {
        page: validatedPage,
        limit: ITEMS_PER_PAGE,
      };

      if (debouncedSearchQuery.trim()) {
        apiFilters.search = debouncedSearchQuery.trim();
      }
      if (categoryFilter !== "All") {
        apiFilters.category = categoryFilter;
      }
      if (statusFilter !== "All") {
        apiFilters.status = statusFilter === "Available" ? "ACTIVE" : "SOLD";
      }
      if (maxPrice < 1000) {
        apiFilters.maxPrice = maxPrice;
      }

      const response = await listingService.getAllListings(apiFilters);
      setProducts(response.listings || []);
      setTotalItems(response.total ?? 0);
      setServerTotalPages(response.pages ?? 1);
      setError("");
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError("Failed to fetch listings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch listings on parameter / filter change
  useEffect(() => {
    fetchListings();
  }, [validatedPage, debouncedSearchQuery, categoryFilter, statusFilter, maxPrice]);

  // Adjust page if it exceeds total pages
  useEffect(() => {
    if (!loading && serverTotalPages > 0 && validatedPage > serverTotalPages) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", serverTotalPages.toString());
        return newParams;
      });
    }
  }, [loading, serverTotalPages, validatedPage, setSearchParams]);

  const resetPage = () => {
    setSearchParams((prev) => {
      const page = prev.get("page");
      if (page && page !== "1") {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", "1");
        return newParams;
      }
      return prev;
    });
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    resetPage();
  };

  const handleCategoryChange = (val) => {
    setCategoryFilter(val);
    resetPage();
  };

  const handleStatusChange = (val) => {
    setStatusFilter(val);
    resetPage();
  };

  const handlePriceChange = (val) => {
    setMaxPrice(val);
    resetPage();
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", newPage.toString());
      return newParams;
    });
    // Smooth scroll to top of featured finds section
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("All");
    setStatusFilter("All");
    setMaxPrice(1000);
    resetPage();
  };

  return (
    <div className="space-y-8">
      {/* Hero / Jumbotron */}
      <HeroSection />

      {/* Filter and Search Section */}
      <ProductFilters
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        categoryFilter={categoryFilter}
        setCategoryFilter={handleCategoryChange}
        statusFilter={statusFilter}
        setStatusFilter={handleStatusChange}
        maxPrice={maxPrice}
        setMaxPrice={handlePriceChange}
      />

      {/* Product Grid Results */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <span>✨ Featured Finds</span>
            {!loading && (
              <span className="text-xs bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full font-bold">
                {totalItems} items
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
        ) : products.length === 0 ? (
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
          <>
            <ProductGrid products={products} />

            {serverTotalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-8">
                <button
                  onClick={() => handlePageChange(validatedPage - 1)}
                  disabled={validatedPage === 1}
                  className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all clay-nav-btn cursor-pointer ${
                    validatedPage === 1
                      ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50 shadow-none transform-none"
                      : "bg-white/80 text-indigo-600 hover:bg-white"
                  }`}
                >
                  ⬅️ Prev
                </button>
                
                <span className="text-xs font-bold text-slate-600 bg-white/70 px-4 py-2 rounded-xl border border-white/80 shadow-sm">
                  Page <b>{validatedPage}</b> of <b>{serverTotalPages || 1}</b>
                </span>

                <button
                  onClick={() => handlePageChange(validatedPage + 1)}
                  disabled={validatedPage >= serverTotalPages || serverTotalPages === 0}
                  className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all clay-nav-btn cursor-pointer ${
                    validatedPage >= serverTotalPages || serverTotalPages === 0
                      ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50 shadow-none transform-none"
                      : "bg-white/80 text-indigo-600 hover:bg-white"
                  }`}
                >
                  Next ➡️
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;