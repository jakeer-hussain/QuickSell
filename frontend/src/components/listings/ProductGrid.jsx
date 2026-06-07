import React from "react";
import ProductCard from "./ProductCard";

function ProductGrid({ products, setSelectedProductId, setActivePage }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard
          key={product._id || product.id}
          product={product}
          setSelectedProductId={setSelectedProductId}
          setActivePage={setActivePage}
        />
      ))}
    </div>
  );
}

export default ProductGrid;