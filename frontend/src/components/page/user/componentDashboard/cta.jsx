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
    <section className="bg-gray-900 w-full max-w-6xl mx-auto text-white py-16 px-4 rounded-[70px] mb-20">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="max-w-lg">
          <h2 className="text-3xl font-extrabold mb-4">Ready to Get Our New Stuff?</h2>
          <p className="text-gray-300">
            Stuffsus for Homes and Needs<br />
            We'll listen to your needs, identify the best approach, and then create a bespoke smart EV charging solution that's right for you.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex w-full max-w-md">
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-grow rounded-l-md px-4 py-3 text-gray-900 focus:outline-none"
          />
          <Button type="submit" className="rounded-r-md bg-white text-gray-900 font-semibold hover:bg-gray-200">
            Send
          </Button>
        </form>
      </div>
    </section>
  );
}
