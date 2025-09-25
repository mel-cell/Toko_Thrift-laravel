import React, { useState, useEffect } from "react";

export default function Search({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  }, [searchTerm, onSearch]);

  return (
    <div className="w-full flex rounded-md overflow-hidden shadow-lg bg-white">
      <input
        type="text"
        placeholder="Search on Stuffsus"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
      />
      <button
        type="button"
        className="bg-black text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-xs sm:text-sm lg:text-base font-semibold hover:bg-gray-900 transition whitespace-nowrap"
        onClick={() => {}}
      >
        Search
      </button>
    </div>
  );
}
