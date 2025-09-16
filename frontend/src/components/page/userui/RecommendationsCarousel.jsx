import React from "react";
import { Carousel, CarouselItem } from "../../ui/carousel";
import ProductCard from "./ProductCard";

export default function RecommendationsCarousel({ recommendations }) {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold mb-4">Explore our recommendations</h2>
      <Carousel>
        {recommendations.map((product) => (
          <CarouselItem key={product.id} className="w-64 p-2">
            <ProductCard product={product} />
          </CarouselItem>
        ))}
      </Carousel>
    </section>
  );
}
