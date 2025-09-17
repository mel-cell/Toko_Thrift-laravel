import React from "react";
import Hero from "../../../components/page/user/componentDashboard/hero";
import ListProduct from "../../../components/page/user/componentDashboard/listproduct";
import RecommendationProduct from "../../../components/page/user/componentDashboard/rekomendationproduct";
import CTA from "../../../components/page/user/componentDashboard/cta";

export default function DashboardPage() {
  return (
    <div>
      <Hero />
      <ListProduct />
      <RecommendationProduct />
      <CTA />
    </div>
  );
}


