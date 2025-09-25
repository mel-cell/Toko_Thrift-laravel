import React, { useState } from "react";
import { Button } from "../../../ui/button";

export default function CTA() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement submission logic here
    alert(`Email submitted: ${email}`);
    setEmail("");
  };

  return (
    <section className="bg-gray-900 w-full max-w-6xl mx-auto text-white py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 rounded-[40px] sm:rounded-[70px] mb-12 sm:mb-16 lg:mb-20">
      <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6">
        <div className="max-w-lg px-4 sm:px-0">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 sm:mb-4">Ready to Get Our New Stuff?</h2>
          <p className="text-gray-300 text-sm sm:text-base">
            Stuffsus for Homes and Needs<br />
            We'll listen to your needs, identify the best approach, and then create a bespoke smart EV charging solution that's right for you.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full max-w-md gap-2 sm:gap-0">
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-grow rounded-md sm:rounded-l-md sm:rounded-r-none px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <Button type="submit" className="rounded-md sm:rounded-r-md sm:rounded-l-none bg-white text-gray-900 font-semibold hover:bg-gray-200 px-6 py-3">
            Send
          </Button>
        </form>
      </div>
    </section>
  );
}
