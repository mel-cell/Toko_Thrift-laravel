import React, { useState } from "react";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search logic or navigation here
    alert(`Searching for: ${searchTerm}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full flex rounded-md overflow-hidden shadow-lg bg-white"
    >
      <input
        type="text"
        placeholder="Search on Stuffsus"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow px-4 py-3 text-gray-900 focus:outline-none"
      />
      <button
        type="submit"
        className="bg-black text-white px-6 py-3 font-semibold hover:bg-gray-900 transition"
      >
        Search
      </button>
    </form>
  );
}
