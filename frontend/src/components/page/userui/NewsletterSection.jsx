import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle email submission logic here
    alert(`Subscribed with ${email}`);
    setEmail("");
  };

  return (
    <section className="bg-gray-900 text-white p-8 rounded-md mt-12 flex flex-col md:flex-row items-center justify-between">
      <div className="mb-4 md:mb-0 max-w-lg">
        <h2 className="text-3xl font-bold">Ready to Get Our New Stuff?</h2>
        <p className="mt-2 text-sm text-gray-300">
          Stuffus for Homes and Needs<br />
          We'll listen to your needs, identify the best approach, and then create a bespoke smart EV charging solution that's right for you.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex space-x-2 w-full max-w-md">
        <Input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-grow"
        />
        <Button type="submit">Send</Button>
      </form>
    </section>
  );
}
