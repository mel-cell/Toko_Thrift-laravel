import React, { useState } from "react";
import ProductCard from "./ProductCard";
import { Pagination, PaginationNext, PaginationPrev, PaginationPage } from "../../ui/pagination";

export default function ProductGrid({ products }) {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const totalPages = Math.ceil(products.length / productsPerPage);

  const currentProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <Pagination currentPage={currentPage} onPageChange={setCurrentPage} totalPages={totalPages}>
          <PaginationPrev>Previous</PaginationPrev>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationPage key={i} page={i + 1} />
          ))}
          <PaginationNext>Next</PaginationNext>
        </Pagination>
      </div>
    </div>
  );
}
