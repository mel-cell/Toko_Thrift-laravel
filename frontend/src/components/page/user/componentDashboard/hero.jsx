import React from "react";
import Image from "next/image";
import Search from "./search";

export default function Hero({ onSearch }) {
  return (
    <section className="relative bg-gray-100 w-full min-h-[600px] flex flex-col justify-center items-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full" aria-hidden="true">
        <Image
          src="/bg.webp"
          alt="Background"
          fill
          style={{ objectFit: "cover" }}
          priority
          className="z-0"
        />
      </div>

      {/* Large Shop Text */}
      <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[15rem] font-extrabold text-white opacity-40 select-none pointer-events-none whitespace-nowrap z-10 leading-none">
        Stuffus
      </h1>

      {/* Content below Shop */}
      <div className="relative z-20 w-full max-w-7xl px-8 flex items-center py-4 justify-between space-x-8 bg-white rounded-t-lg shadow-lg top-65">
        <h2 className="text-3xl font-semibold text-gray-900 select-none flex-shrink-0">
          Give All You Need
        </h2>
        <div className="flex-grow max-w-xl">
          <Search onSearch={onSearch} />
        </div>
      </div>
    </section>
  );
}
