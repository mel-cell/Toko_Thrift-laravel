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
        className="flex-grow px-4 py-3 text-gray-900 focus:outline-none"
      />
      <button
        type="button"
        className="bg-black text-white px-6 py-3 font-semibold hover:bg-gray-900 transition"
        onClick={() => {}}
      >
        Search
      </button>
    </div>
  );
}
