import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UserHeader from "./(user)/UserHeader";
import Footer from "./(user)/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Stuffus Shop",
  description: "Shop page for Stuffus",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* Header and Footer from (user) folder */}
        <UserHeader />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
