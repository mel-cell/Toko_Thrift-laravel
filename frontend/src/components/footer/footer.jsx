import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between">
        <div className="flex space-x-16 mb-6 md:mb-0">
          <div>
            <h3 className="text-sm font-semibold mb-3">About</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="/blog" className="hover:underline">Blog</a></li>
              <li><a href="/meet-the-team" className="hover:underline">Meet The Team</a></li>
              <li><a href="/contact" className="hover:underline">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Support</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="/contact" className="hover:underline">Contact Us</a></li>
              <li><a href="/shipping" className="hover:underline">Shipping</a></li>
              <li><a href="/return" className="hover:underline">Return</a></li>
              <li><a href="/faq" className="hover:underline">FAQ</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex space-x-4 mb-4 md:mb-0 justify-end">
            <a href="https://twitter.com" aria-label="X" className="text-gray-500 hover:text-gray-900">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14.86 4.48 4.48 0 001.98-2.48 9.14 9.14 0 01-2.88 1.1 4.52 4.52 0 00-7.7 4.13A12.84 12.84 0 013 4.15a4.52 4.52 0 001.4 6.04 4.48 4.48 0 01-2.05-.57v.06a4.52 4.52 0 003.63 4.43 4.52 4.52 0 01-2.04.08 4.52 4.52 0 004.22 3.14A9.05 9.05 0 013 19.54a12.8 12.8 0 006.92 2.03c8.3 0 12.84-6.88 12.84-12.84 0-.2 0-.42-.02-.63A9.22 9.22 0 0023 3z"/></svg>
            </a>
            <a href="https://facebook.com" aria-label="Facebook" className="text-gray-500 hover:text-gray-900">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12a10 10 0 10-11.5 9.87v-7h-2v-3h2v-2c0-2 1-3 3-3h2v3h-2c-.5 0-1 .5-1 1v1h3l-1 3h-2v7A10 10 0 0022 12z"/></svg>
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" className="text-gray-500 hover:text-gray-900">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 3a2 2 0 110 4 2 2 0 010-4z"/></svg>
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="text-gray-500 hover:text-gray-900">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 3a1 1 0 110 2 1 1 0 010-2zm-5 2a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z"/></svg>
            </a>
          </div>
          <div className="text-xs text-gray-400 flex justify-between w-full">
            <span>© 2023 Uangku. All Rights Reserved.</span>
            <div className="space-x-4">
              <a href="/terms" className="hover:underline">Terms of Service</a>
              <a href="/privacy" className="hover:underline">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
