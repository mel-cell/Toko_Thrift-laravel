'use client';

import React, { useState } from "react";
import Hero from "../../../components/page/user/componentDashboard/hero";
import ListProduct from "../../../components/page/user/componentDashboard/listproduct";
import RecommendationProduct from "../../../components/page/user/componentDashboard/rekomendationproduct";
import CTA from "../../../components/page/user/componentDashboard/cta";

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="min-h-screen">
      <Hero onSearch={handleSearch} />
      <div className="bg-white">
        <ListProduct searchTerm={searchTerm} />
      </div>
      <RecommendationProduct />
      <CTA />
    </div>
  );
}

