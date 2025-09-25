import React from "react";
import Image from "next/image";
import Search from "./search";

export default function Hero({ onSearch }) {
  return (
    <section className="relative bg-gray-100 w-full min-h-screen sm:min-h-[500px] lg:min-h-[600px] flex flex-col justify-center items-center overflow-hidden">
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

      {/* Large Shop Text - Responsive */}
      <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl 2xl:text-[10rem] font-extrabold text-white opacity-40 select-none pointer-events-none whitespace-nowrap z-10 leading-none">
        Stuffus
      </h1>

      {/* Content below Shop - Positioned right below the large text */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-lg shadow-lg">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 lg:py-6">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between space-x-6 xl:space-x-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-900 select-none flex-shrink-0">
              Give All You Need
            </h2>
            <div className="flex-grow max-w-lg xl:max-w-xl">
              <Search onSearch={onSearch} />
            </div>
          </div>

          {/* Tablet Layout */}
          <div className="hidden md:flex lg:hidden items-center justify-between space-x-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 select-none flex-shrink-0">
              Give All You Need
            </h2>
            <div className="flex-grow max-w-md">
              <Search onSearch={onSearch} />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 select-none text-center">
              Give All You Need
            </h2>
            <div className="w-full max-w-sm mx-auto">
              <Search onSearch={onSearch} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
