import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-8 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold mb-4">About</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="/blog" className="hover:underline">Blog</a></li>
            <li><a href="/about" className="hover:underline">Meet The Team</a></li>
            <li><a href="/contact" className="hover:underline">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Support</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="/contact" className="hover:underline">Contact Us</a></li>
            <li><a href="/shipping" className="hover:underline">Shipping</a></li>
            <li><a href="/return" className="hover:underline">Return</a></li>
            <li><a href="/faq" className="hover:underline">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Social Media</h3>
          <div className="flex space-x-4 text-gray-600">
            <a href="https://twitter.com" aria-label="Twitter" className="hover:text-black">X</a>
            <a href="https://facebook.com" aria-label="Facebook" className="hover:text-black">F</a>
            <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-black">in</a>
            <a href="https://instagram.com" aria-label="Instagram" className="hover:text-black">IG</a>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 mt-8">
        &copy; {new Date().getFullYear()} Stuffus. All rights reserved.
      </div>
    </footer>
  );
}
